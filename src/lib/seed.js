import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import Category from "../models/category.model.js";

dotenv.config({ path: ".env.local" });

const categories = [
  { name: "Electronics", description: "Electronic devices and gadgets" },
  { name: "Clothing", description: "Apparel and fashion items" },
  { name: "Home & Garden", description: "Home improvement and gardening supplies" },
  { name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
  { name: "Books", description: "Books and literature" },
  { name: "Beauty & Personal Care", description: "Cosmetics and personal care products" },
  { name: "Toys & Games", description: "Toys, games, and entertainment" },
  { name: "Automotive", description: "Car parts and automotive accessories" },
  { name: "Health & Household", description: "Health products and household essentials" },
  { name: "Jewelry & Watches", description: "Jewelry, watches, and accessories" },
  { name: "Shoes", description: "Footwear for men, women, and children" },
  { name: "Furniture", description: "Home and office furniture" },
  { name: "Pet Supplies", description: "Products for pets" },
  { name: "Office Products", description: "Office supplies and equipment" },
  { name: "Musical Instruments", description: "Instruments and music accessories" },
  { name: "Grocery & Gourmet Food", description: "Food and gourmet items" },
  { name: "Baby", description: "Baby products and essentials" },
  { name: "Tools & Home Improvement", description: "Tools and home improvement items" },
  { name: "Industrial & Scientific", description: "Industrial and scientific equipment" },
  { name: "Arts & Crafts", description: "Art supplies and craft materials" }
];

const seedCategories = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing categories if needed
    // await Category.deleteMany({});

    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category ${cat.name} already exists`);
      }
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();