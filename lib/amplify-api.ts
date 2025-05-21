import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { get, post, put, del } from 'aws-amplify/api';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { Product, Farm, Category, User, CartItem, Recommendation } from '@/types';

// Create a client for GraphQL operations
const client = generateClient();

// GraphQL queries and mutations
const queries = {
  // Products
  listProducts: /* GraphQL */ `
    query ListProducts($filter: ModelProductFilterInput, $limit: Int, $nextToken: String) {
      listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          name
          description
          price
          image
          category
          subcategory
          variety
          farmId
          organic
          inSeason
          preHarvest
          freshness
          harvestDate
          zone
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  `,
  getProduct: /* GraphQL */ `
    query GetProduct($id: ID!) {
      getProduct(id: $id) {
        id
        name
        description
        price
        image
        category
        subcategory
        variety
        farmId
        organic
        inSeason
        preHarvest
        freshness
        harvestDate
        zone
        createdAt
        updatedAt
      }
    }
  `,
  
  // Farms
  listFarms: /* GraphQL */ `
    query ListFarms($filter: ModelFarmFilterInput, $limit: Int, $nextToken: String) {
      listFarms(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          name
          description
          image
          coverImage
          location
          deliveryZones
          rating
          reviewCount
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  `,
  getFarm: /* GraphQL */ `
    query GetFarm($id: ID!) {
      getFarm(id: $id) {
        id
        name
        description
        image
        coverImage
        location
        deliveryZones
        rating
        reviewCount
        createdAt
        updatedAt
      }
    }
  `,
  
  // Categories
  listCategories: /* GraphQL */ `
    query ListCategories($filter: ModelCategoryFilterInput, $limit: Int, $nextToken: String) {
      listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          name
          image
          subcategories {
            items {
              id
              name
              image
              varieties {
                items {
                  id
                  name
                  image
                }
              }
            }
          }
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  `,

  // User Cart
  getUserCart: /* GraphQL */ `
    query GetUserCart($userId: ID!) {
      listCartItems(filter: { userId: { eq: $userId } }) {
        items {
          id
          userId
          productId
          farmId
          quantity
          price
          product {
            id
            name
            image
            price
            farmId
            farm {
              id
              name
            }
          }
          createdAt
          updatedAt
        }
      }
    }
  `,

  // User Favorites
  getUserFavorites: /* GraphQL */ `
    query GetUserFavorites($userId: ID!) {
      listFavorites(filter: { userId: { eq: $userId } }) {
        items {
          id
          userId
          itemId
          itemType
          createdAt
          updatedAt
        }
      }
    }
  `,

  // User Orders
  getUserOrders: /* GraphQL */ `
    query GetUserOrders($userId: ID!) {
      listOrders(filter: { userId: { eq: $userId } }) {
        items {
          id
          userId
          total
          status
          deliveryDate
          createdAt
          updatedAt
          items {
            items {
              id
              productId
              quantity
              price
              product {
                id
                name
                image
              }
            }
          }
        }
      }
    }
  `,
};

const mutations = {
  // User profile
  updateUserProfile: /* GraphQL */ `
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        id
        username
        email
        name
        phone
        avatar
        createdAt
        updatedAt
      }
    }
  `,
  
  // Cart
  createCartItem: /* GraphQL */ `
    mutation CreateCartItem($input: CreateCartItemInput!) {
      createCartItem(input: $input) {
        id
        userId
        productId
        farmId
        quantity
        price
        createdAt
        updatedAt
      }
    }
  `,
  updateCartItem: /* GraphQL */ `
    mutation UpdateCartItem($input: UpdateCartItemInput!) {
      updateCartItem(input: $input) {
        id
        userId
        productId
        farmId
        quantity
        price
        createdAt
        updatedAt
      }
    }
  `,
  deleteCartItem: /* GraphQL */ `
    mutation DeleteCartItem($input: DeleteCartItemInput!) {
      deleteCartItem(input: $input) {
        id
      }
    }
  `,

  // Favorites
  createFavorite: /* GraphQL */ `
    mutation CreateFavorite($input: CreateFavoriteInput!) {
      createFavorite(input: $input) {
        id
        userId
        itemId
        itemType
        createdAt
        updatedAt
      }
    }
  `,
  deleteFavorite: /* GraphQL */ `
    mutation DeleteFavorite($input: DeleteFavoriteInput!) {
      deleteFavorite(input: $input) {
        id
      }
    }
  `,

  // Orders
  createOrder: /* GraphQL */ `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
        userId
        total
        status
        deliveryDate
        createdAt
        updatedAt
      }
    }
  `,
  createOrderItem: /* GraphQL */ `
    mutation CreateOrderItem($input: CreateOrderItemInput!) {
      createOrderItem(input: $input) {
        id
        orderId
        productId
        farmId
        quantity
        price
        createdAt
        updatedAt
      }
    }
  `,
};

// Type for GraphQL responses
interface GraphQLResponse<T> {
  data?: T;
  errors?: any[];
}

interface ListProductsResponse {
  listProducts: {
    items: Product[];
    nextToken: string | null;
  };
}

interface GetProductResponse {
  getProduct: Product;
}

interface ListFarmsResponse {
  listFarms: {
    items: Farm[];
    nextToken: string | null;
  };
}

interface GetFarmResponse {
  getFarm: Farm;
}

interface ListCategoriesResponse {
  listCategories: {
    items: Category[];
    nextToken: string | null;
  };
}

interface UpdateUserResponse {
  updateUser: User;
}

interface CartItemResponse {
  id: string;
  userId: string;
  productId: string;
  farmId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCartItemResponse {
  createCartItem: CartItemResponse;
}

interface UpdateCartItemResponse {
  updateCartItem: CartItemResponse;
}

interface DeleteCartItemResponse {
  deleteCartItem: {
    id: string;
  };
}

interface FavoriteResponse {
  id: string;
  userId: string;
  itemId: string;
  itemType: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateFavoriteResponse {
  createFavorite: FavoriteResponse;
}

interface DeleteFavoriteResponse {
  deleteFavorite: {
    id: string;
  };
}

interface OrderResponse {
  id: string;
  userId: string;
  total: number;
  status: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderResponse {
  createOrder: OrderResponse;
}

interface OrderItemResponse {
  id: string;
  orderId: string;
  productId: string;
  farmId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderItemResponse {
  createOrderItem: OrderItemResponse;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}

// API functions
export const AmplifyAPI = {
  // Products
  async getProducts(filter?: any): Promise<Product[]> {
    try {
      const result = await client.graphql<ListProductsResponse>({
        query: queries.listProducts,
        variables: { filter, limit: 100 }
      });
      
      return result.data?.listProducts.items || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  async getProductById(id: string): Promise<Product> {
    try {
      const result = await client.graphql<GetProductResponse>({
        query: queries.getProduct,
        variables: { id }
      });
      
      if (result.data?.getProduct) {
        return result.data.getProduct;
      }
      throw new Error(`Product with ID ${id} not found`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  // Farms
  async getFarms(filter?: any): Promise<Farm[]> {
    try {
      const result = await client.graphql<ListFarmsResponse>({
        query: queries.listFarms,
        variables: { filter, limit: 100 }
      });
      
      return result.data?.listFarms.items || [];
    } catch (error) {
      console.error('Error fetching farms:', error);
      throw error;
    }
  },
  
  async getFarmById(id: string): Promise<Farm> {
    try {
      const result = await client.graphql<GetFarmResponse>({
        query: queries.getFarm,
        variables: { id }
      });
      
      if (result.data?.getFarm) {
        return result.data.getFarm;
      }
      throw new Error(`Farm with ID ${id} not found`);
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error);
      throw error;
    }
  },
  
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const result = await client.graphql<ListCategoriesResponse>({
        query: queries.listCategories,
        variables: { limit: 100 }
      });
      
      return result.data?.listCategories.items || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // User profile
  async updateUserProfile(userProfile: Partial<User>): Promise<User> {
    try {
      const result = await client.graphql<UpdateUserResponse>({
        query: mutations.updateUserProfile,
        variables: { input: userProfile }
      });
      
      if (result.data?.updateUser) {
        return result.data.updateUser;
      }
      throw new Error('Failed to update user profile');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Cart operations
  async getUserCart(userId: string): Promise<CartItem[]> {
    try {
      const result = await client.graphql({
        query: queries.getUserCart,
        variables: { userId }
      });
      
      // Type assertion to access the data
      const typedResult = result as GraphQLResponse<{ listCartItems: { items: CartItem[] } }>;
      return typedResult.data?.listCartItems.items || [];
    } catch (error) {
      console.error('Error fetching user cart:', error);
      throw error;
    }
  },
  
  async addToCart(userId: string, product: Product, quantity: number): Promise<CartItemResponse> {
    try {
      const result = await client.graphql<CreateCartItemResponse>({
        query: mutations.createCartItem,
        variables: { 
          input: {
            userId,
            productId: product.id,
            farmId: product.farmId,
            quantity,
            price: product.price
          }
        }
      });
      
      if (result.data?.createCartItem) {
        return result.data.createCartItem;
      }
      throw new Error('Failed to add item to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },
  
  async updateCartItem(cartItemId: string, quantity: number): Promise<CartItemResponse> {
    try {
      const result = await client.graphql<UpdateCartItemResponse>({
        query: mutations.updateCartItem,
        variables: { 
          input: {
            id: cartItemId,
            quantity
          }
        }
      });
      
      if (result.data?.updateCartItem) {
        return result.data.updateCartItem;
      }
      throw new Error('Failed to update cart item');
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },
  
  async removeFromCart(cartItemId: string): Promise<{ id: string }> {
    try {
      const result = await client.graphql<DeleteCartItemResponse>({
        query: mutations.deleteCartItem,
        variables: { 
          input: {
            id: cartItemId
          }
        }
      });
      
      if (result.data?.deleteCartItem) {
        return result.data.deleteCartItem;
      }
      throw new Error('Failed to remove item from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },
  
  // Favorites operations
  async getUserFavorites(userId: string): Promise<FavoriteResponse[]> {
    try {
      const result = await client.graphql({
        query: queries.getUserFavorites,
        variables: { userId }
      });
      
      // Type assertion to access the data
      const typedResult = result as GraphQLResponse<{ listFavorites: { items: FavoriteResponse[] } }>;
      return typedResult.data?.listFavorites.items || [];
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  },
  
  async addToFavorites(userId: string, itemId: string, itemType: 'product' | 'farm'): Promise<FavoriteResponse> {
    try {
      const result = await client.graphql<CreateFavoriteResponse>({
        query: mutations.createFavorite,
        variables: { 
          input: {
            userId,
            itemId,
            itemType
          }
        }
      });
      
      if (result.data?.createFavorite) {
        return result.data.createFavorite;
      }
      throw new Error('Failed to add to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },
  
  async removeFromFavorites(favoriteId: string): Promise<{ id: string }> {
    try {
      const result = await client.graphql<DeleteFavoriteResponse>({
        query: mutations.deleteFavorite,
        variables: { 
          input: {
            id: favoriteId
          }
        }
      });
      
      if (result.data?.deleteFavorite) {
        return result.data.deleteFavorite;
      }
      throw new Error('Failed to remove from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },
  
  // Orders operations
  async getUserOrders(userId: string): Promise<any[]> {
    try {
      const result = await client.graphql({
        query: queries.getUserOrders,
        variables: { userId }
      });
      
      // Type assertion to access the data
      const typedResult = result as GraphQLResponse<{ listOrders: { items: any[] } }>;
      return typedResult.data?.listOrders.items || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  
  async createOrder(userId: string, total: number, items: any[]): Promise<string> {
    try {
      // First create the order
      const orderResult = await client.graphql<CreateOrderResponse>({
        query: mutations.createOrder,
        variables: { 
          input: {
            userId,
            total,
            status: 'PENDING'
          }
        }
      });
      
      if (!orderResult.data?.createOrder) {
        throw new Error('Failed to create order');
      }
      
      const orderId = orderResult.data.createOrder.id;
      
      // Then create order items
      for (const item of items) {
        await client.graphql<CreateOrderItemResponse>({
          query: mutations.createOrderItem,
          variables: { 
            input: {
              orderId,
              productId: item.productId,
              farmId: item.farmId,
              quantity: item.quantity,
              price: item.price
            }
          }
        });
      }
      
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Storage operations
  async uploadImage(file: any, key: string): Promise<string> {
    try {
      await uploadData({
        key,
        data: file,
        options: {
          contentType: file.type
        }
      });
      
      const result = await getUrl({
        key
      });
      
      return result.url.toString();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  async deleteImage(key: string): Promise<void> {
    try {
      await remove({
        key
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
  
  // REST API example
  async getProductRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      const restOperation = get({
        apiName: 'farmFreshAPI',
        path: `/recommendations/${userId}`,
      });
      
      const { body } = await restOperation.response;
      const json = await body.json();
      
      // Type guard to check if json is an object with recommendations property
      if (json && typeof json === 'object' && 'recommendations' in json) {
        return (json as RecommendationsResponse).recommendations;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      throw error;
    }
  }
};