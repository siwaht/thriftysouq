import { Router } from "express";
import { storage } from "../storage";
import { insertProductSchema, insertMenuItemSchema, insertWebhookSchema, insertHeroBannerSchema, insertPaymentCredentialSchema } from "@shared/schema";
import { z } from "zod";
import { requireAdminAuth } from "../middleware/auth";
import { createAdminSession, deleteAdminSession, validateAdminSession, getActiveSessionCount } from "../simple-auth";
import { aiMarketing } from "../ai-marketing";
import { providerRegistry } from "../ai/provider-registry";
import bcrypt from "bcryptjs";

const router = Router();

// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await storage.getAdminUserByUsername(username);

        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate session
        const sessionId = createAdminSession(admin.id, admin.username);
        console.log("Admin login successful:", admin.username);

        // Set session cookie
        res.cookie('adminSessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax'
        });

        res.json({
            message: "Login successful",
            admin: { id: admin.id, username: admin.username },
            sessionId // Return for client-side storage as backup
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

router.post("/logout", (req, res) => {
    const sessionId = req.cookies?.adminSessionId;
    if (sessionId) {
        deleteAdminSession(sessionId);
    }
    console.log("Admin logout - clearing session");
    res.clearCookie('adminSessionId');
    res.json({ message: "Logout successful" });
});

router.get("/auth-status", (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminSessionId;
    let isAuthenticated = false;
    let adminData = null;

    if (sessionId) {
        adminData = validateAdminSession(sessionId);
        isAuthenticated = !!adminData;
    }

    res.json({
        isAuthenticated,
        session: sessionId ? 'present' : 'missing',
        admin: adminData ? { username: adminData.username } : null,
        debug: {
            hasSession: !!sessionId,
            sessionValid: isAuthenticated,
            activeSessions: getActiveSessionCount()
        }
    });
});

// Admin Product Routes
router.get("/products", requireAdminAuth, async (req, res) => {
    try {
        const products = await storage.getProducts();
        res.json(products);
    } catch (error) {
        console.error("Failed to fetch products for admin:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

router.post("/products", requireAdminAuth, async (req, res) => {
    try {
        const productData = insertProductSchema.parse(req.body);
        const product = await storage.createProduct(productData);
        res.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid product data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to create product" });
    }
});

router.put("/products/:id", requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const productData = insertProductSchema.parse(req.body);
        const product = await storage.updateProduct(id, productData);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid product data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to update product" });
    }
});

router.delete("/products/:id", requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const success = await storage.deleteProduct(id);

        if (!success) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product" });
    }
});

router.post("/products/bulk-import", requireAdminAuth, async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required" });
        }

        const results = {
            success: 0,
            errors: [] as string[]
        };

        for (let i = 0; i < products.length; i++) {
            try {
                const productData = products[i];

                // Validate required fields
                if (!productData.name || !productData.brand || !productData.category ||
                    !productData.originalPrice || !productData.discountedPrice ||
                    typeof productData.discount !== 'number' || typeof productData.stock !== 'number') {
                    results.errors.push(`Product ${i + 1}: Missing or invalid required fields`);
                    continue;
                }

                // Validate category
                if (!["watches", "jewelry", "fashion", "accessories", "beauty"].includes(productData.category)) {
                    results.errors.push(`Product ${i + 1}: Invalid category`);
                    continue;
                }

                // Create product
                await storage.createProduct({
                    name: productData.name,
                    brand: productData.brand,
                    category: productData.category,
                    originalPrice: productData.originalPrice,
                    discountedPrice: productData.discountedPrice,
                    discount: productData.discount,
                    image: productData.image || "https://via.placeholder.com/400x400",
                    stock: productData.stock
                });

                results.success++;
            } catch (error) {
                results.errors.push(`Product ${i + 1}: Failed to create product - ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Failed to process bulk import" });
    }
});

// Admin Menu Items
router.post("/menu-items", requireAdminAuth, async (req, res) => {
    try {
        const menuData = insertMenuItemSchema.parse(req.body);
        const menuItem = await storage.createMenuItem(menuData);
        res.json(menuItem);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to create menu item" });
    }
});

router.put("/menu-items/:id", requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid menu item ID" });
        }

        const menuData = insertMenuItemSchema.parse(req.body);
        const menuItem = await storage.updateMenuItem(id, menuData);

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.json(menuItem);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to update menu item" });
    }
});

router.delete("/menu-items/:id", requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid menu item ID" });
        }

        const success = await storage.deleteMenuItem(id);

        if (!success) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete menu item" });
    }
});

router.put("/menu-items/:id/order", requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { newOrder } = req.body;

        if (isNaN(id) || typeof newOrder !== 'number') {
            return res.status(400).json({ message: "Invalid data" });
        }

        await storage.updateMenuItemOrder(id, newOrder);
// User Management
router.get("/users", requireAdminAuth, async (req, res) => {
    try {
        const users = await storage.getAdminUsers();
        const safeUsers = users.map(({ passwordHash, ...user }) => user);
        res.json(safeUsers);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
router.post("/users", requireAdminAuth, async (req, res) => {
    try {
        const { username, email, password, role, isActive } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await storage.createAdminUser({
            username, email, passwordHash, role: role || "admin", isActive: isActive !== undefined ? isActive : true
        });
        const { passwordHash: _, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error) {
        console.error("Failed to create user:", error);
        res.status(500).json({ message: error.message || "Failed to create user" });
    }
});
router.put("/users/:id", requireAdminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, email, password, role, isActive } = req.body;
        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (isActive !== undefined) updates.isActive = isActive;
        if (password) updates.passwordHash = await bcrypt.hash(password, 10);
        const updatedUser = await storage.updateAdminUser(userId, updates);
        const { passwordHash: _, ...safeUser } = updatedUser;
        res.json(safeUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ message: error.message || "Failed to update user" });
    }
});
router.delete("/users/:id", requireAdminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        await storage.deleteAdminUser(userId);
        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete user:", error);
        res.status(500).json({ message: error.message || "Failed to delete user" });
    }
});
// Webhook Management
router.get("/webhooks", requireAdminAuth, async (req, res) => {
    try {
        const webhooks = await storage.getWebhooks();
        res.json(webhooks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch webhooks" });
    }
});
                                                                

     

                                                        

                                                         

                  


                 

                                  

                                                                                    });


 

                                                           });


 


   



                                                                   

     

                                   

                

                                                            });


 



                                                        

                                                             



               

                                                           });


 



                  


                 

                                  

                                                                                    });


 

                                                           });


 


   



                                                                      

     

                                   

                

                                                            });


 



                                                



               

                                                           });


 



                                                   });


                 

                                                           });


 


   



                                                                         

     

                                   

                                             

                                                



               

                                                           });


 



                    

                     

                      

                                    

       

                                                   

                       

                          


 


  



     

                                           

               

          

                                   

                                   


  

                                  


   



                  

                                                                              });


        

                                                                                           });


 


                        

                                                                                           });


 


                 

                                                         });


 


   



                         

                                                                  

     

                                                          

                                                          

                 


                 

                                  

                                                                                        });


 

                                                               });


 


   



                      

                                                                          

     

                                                          

                      


                 

                                                                      });


 


   



                                                                           

     

                                                                     

                                                                         

                     


                 

                                  

                                                                                       });


 

                                                                    });


 


   



                                                                                 

     

                                   

                                          

                         });


                 

                                                                      });


 


   



                      

                                                                     

     

               } = req.body;



                             

                                                                  });


 



                 

           

                      


  



                                         

     

                            



                           

                                                                                      

                                                                            

                                                      

                                                               

         


 



                          

              } = await storage.createOrder({

                                     

                                       

                                       

                                           

                     

                                         

                                                           

                                       

                       

                                     


                    



                  


                 

                                                                                                      


 


 



          

              

                                 

       


   


                 

                                                          });


 


   



                                                                    

     

                                                  



                               

                                      

                               

                                 

                                   

                                   

                                       

                 

                                   

                                                     

                                   

                   

                     

                                    

                               

                                                                                           

                  


    



          

              

              

                     


   


                 

                                                          });


 


   



               

                                                                            

     

                                       

                                             

                                                



                            

                                                                            });


 



                                                                 

                          

                

                   

                                                                                                                      

                

                                                      

                                                          

                                                             

  

                        

                                                         

                                                      

                                                        

  

                 

                                                                  

                                                       

                                                  

 


  



                                                        

             

     

                                                       

                                                     


                   

                                                                                                                 

                            


 



                   


                 

                                           

                                                                                                                                    });


 


   



                                                                                    

     

                              } = req.body;

                                             



                            

                                                                                      });


 



                               

                         

                          

                    

                            

                              

                                                                                                                                                                                                                                    

                       

                                                    

                                                                                                  

                                                                                                      

                                                                          


  



            

     

                              

                                                                          


        

                                                                


 

                                               


                   

                                                                                                                           

                          


 



                                         });


                 

                                                     

                                                                               });


 


   



                                                                                  

     

                                             



                            

                                                                                      });


 



                                      

                        

                

                        

                     

                         

                           

                                                                                                           

                       

                                      

                                                                        

                                                                               

                                                                         


  

                

                       

                   

                             

                             

                                                                                                                                  

                      

                                         

                                                                   

                                                                               

                                                                                  


  

              

                            

                    

                            

                           

                                                                                                                                                

                       

                                                

                                                                                                     

                                                                                                   

                                                                                                         


  

                                                                                                                


  



           

     

                                                           

                                            


                   

                                                                                                                        

                        


 



                 


                 

                                                  

                                                                     });


 


   



                                                                                            

     

                                   

                

                                                            });


 



                                                 

               

                                                           });


 



                                                                            

                       


                 

                                                              

                                                                                  });


 


   



                                                                                 

     

                } = req.body;



               

                                                             });


 



                                             

                    

                                               

                                         

                                                  

                                                  

                                                                                                

                                             

                                                           


  



                                                          

                                                                        });


                 

                                                    

                                                                       });


 


   



             

                                                                                 

     

                                  } = req.body;



            

                                                          });


 



                                                             

                                                                 



         

                             

                                    


   



                      


                 

                                              

                                                            });


 


   



                                                                              

     

                   } = req.query;

                                                                       

                                          

                 


                 

                                            

                                                         });


 


   



                      


export default router;
