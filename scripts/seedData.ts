import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { mockFarms } from '../mocks/farmData';
import { mockProducts, mockCategories } from '../mocks/productData';
import { mockFarmPosts, mockComments } from '../mocks/socialData';
import config from '../lib/amplify-config';

// Initialize Amplify with your configuration
Amplify.configure(config);

// Create a client for GraphQL operations
const client = generateClient();

// GraphQL mutations
const mutations = {
  // Farm mutations
  createFarm: /* GraphQL */ `
    mutation CreateFarm($input: CreateFarmInput!) {
      createFarm(input: $input) {
        id
        name
      }
    }
  `,
  
  // Category mutations
  createCategory: /* GraphQL */ `
    mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        id
        name
      }
    }
  `,
  
  createSubcategory: /* GraphQL */ `
    mutation CreateSubcategory($input: CreateSubcategoryInput!) {
      createSubcategory(input: $input) {
        id
        name
      }
    }
  `,
  
  createVariety: /* GraphQL */ `
    mutation CreateVariety($input: CreateVarietyInput!) {
      createVariety(input: $input) {
        id
        name
      }
    }
  `,
  
  // Product mutations
  createProduct: /* GraphQL */ `
    mutation CreateProduct($input: CreateProductInput!) {
      createProduct(input: $input) {
        id
        name
      }
    }
  `,
  
  // Farm post mutations
  createFarmPost: /* GraphQL */ `
    mutation CreateFarmPost($input: CreateFarmPostInput!) {
      createFarmPost(input: $input) {
        id
        title
      }
    }
  `,
  
  // Comment mutations
  createComment: /* GraphQL */ `
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        id
        content
      }
    }
  `,
};

// Helper function to delay between API calls to avoid throttling
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Seed farms
async function seedFarms() {
  console.log('Seeding farms...');
  
  for (const farm of mockFarms) {
    try {
      // Convert the farm object to match the GraphQL schema
      const input = {
        id: farm.id,
        name: farm.name,
        description: farm.description,
        image: farm.logo,
        coverImage: farm.coverImage,
        location: JSON.stringify(farm.location),
        deliveryZones: farm.deliveryZones.map(zone => JSON.stringify(zone)),
        rating: farm.rating,
        reviewCount: farm.reviewCount,
      };
      
      const result = await client.graphql({
        query: mutations.createFarm,
        variables: { input }
      });
      
      console.log(`Created farm: ${farm.name} (${farm.id})`);
      
      // Add a small delay to avoid API throttling
      await delay(500);
    } catch (error) {
      console.error(`Error creating farm ${farm.name}:`, error);
    }
  }
  
  console.log('Finished seeding farms.');
}

// Seed categories, subcategories, and varieties
async function seedCategories() {
  console.log('Seeding categories...');
  
  for (const category of mockCategories) {
    try {
      // Create category
      const categoryInput = {
        id: category.id,
        name: category.name,
        image: category.image,
      };
      
      const categoryResult = await client.graphql({
        query: mutations.createCategory,
        variables: { input: categoryInput }
      });
      
      console.log(`Created category: ${category.name} (${category.id})`);
      
      // Create subcategories
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          const subcategoryInput = {
            id: subcategory.id,
            categoryId: category.id,
            name: subcategory.name,
            image: subcategory.image,
          };
          
          const subcategoryResult = await client.graphql({
            query: mutations.createSubcategory,
            variables: { input: subcategoryInput }
          });
          
          console.log(`Created subcategory: ${subcategory.name} (${subcategory.id})`);
          
          // Create varieties
          if (subcategory.varieties) {
            for (const variety of subcategory.varieties) {
              const varietyInput = {
                id: variety.id,
                subcategoryId: subcategory.id,
                name: variety.name,
                image: variety.image,
              };
              
              const varietyResult = await client.graphql({
                query: mutations.createVariety,
                variables: { input: varietyInput }
              });
              
              console.log(`Created variety: ${variety.name} (${variety.id})`);
              
              await delay(200);
            }
          }
          
          await delay(300);
        }
      }
      
      await delay(500);
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }
  
  console.log('Finished seeding categories.');
}

// Seed products
async function seedProducts() {
  console.log('Seeding products...');
  
  for (const product of mockProducts) {
    try {
      // Convert the product object to match the GraphQL schema
      const input = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        variety: product.variety,
        farmId: product.farmId,
        organic: product.organic,
        inSeason: product.inSeason,
        preHarvest: product.preHarvest,
        freshness: product.freshness,
        harvestDate: product.harvestDate,
        stock: product.stock,
      };
      
      const result = await client.graphql({
        query: mutations.createProduct,
        variables: { input }
      });
      
      console.log(`Created product: ${product.name} (${product.id})`);
      
      // Add a small delay to avoid API throttling
      await delay(300);
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }
  
  console.log('Finished seeding products.');
}

// Seed farm posts
async function seedFarmPosts() {
  console.log('Seeding farm posts...');
  
  for (const post of mockFarmPosts) {
    try {
      // Convert the post object to match the GraphQL schema
      const input = {
        id: post.id,
        farmId: post.farmId,
        title: post.content.substring(0, 50), // Use first 50 chars as title
        content: post.content,
        image: post.images && post.images.length > 0 ? post.images[0] : null,
        likes: post.likes,
      };
      
      const result = await client.graphql({
        query: mutations.createFarmPost,
        variables: { input }
      });
      
      console.log(`Created farm post: ${post.id}`);
      
      // Add a small delay to avoid API throttling
      await delay(300);
    } catch (error) {
      console.error(`Error creating farm post ${post.id}:`, error);
    }
  }
  
  console.log('Finished seeding farm posts.');
}

// Seed comments
async function seedComments() {
  console.log('Seeding comments...');
  
  for (const [postId, comments] of Object.entries(mockComments)) {
    for (const comment of comments) {
      try {
        // Convert the comment object to match the GraphQL schema
        const input = {
          id: comment.id,
          postId: postId,
          userId: comment.userId,
          content: comment.content,
        };
        
        const result = await client.graphql({
          query: mutations.createComment,
          variables: { input }
        });
        
        console.log(`Created comment: ${comment.id}`);
        
        // Add a small delay to avoid API throttling
        await delay(200);
      } catch (error) {
        console.error(`Error creating comment ${comment.id}:`, error);
      }
    }
  }
  
  console.log('Finished seeding comments.');
}

// Main function to seed all data
async function seedAllData() {
  try {
    console.log('Starting data seeding process...');
    
    // Seed in the correct order to handle dependencies
    await seedFarms();
    await seedCategories();
    await seedProducts();
    await seedFarmPosts();
    await seedComments();
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
  }
}

// Run the seeding process
seedAllData();