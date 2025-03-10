import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '@/types/blog';
import { generateTranslations } from './translationService';

// In-memory blog posts store
let blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Our Platform',
    slug: 'getting-started-with-our-platform',
    excerpt: 'A comprehensive guide to help you get up and running with our enterprise solutions.',
    content: '<p>Welcome to our platform! This guide will walk you through the essential steps to get started and make the most of our features.</p><h2>Setting Up Your Account</h2><p>The first step is to set up your account properly. Make sure to fill in all the required information and set up two-factor authentication for added security.</p><h2>Exploring the Dashboard</h2><p>Once logged in, you\'ll be greeted by our intuitive dashboard. Here, you can monitor key metrics, access recent activities, and quickly navigate to different sections of the platform.</p><h2>Creating Your First Project</h2><p>To create a new project, click on the "New Project" button in the top right corner. Fill in the project details, set your objectives, and invite team members to collaborate.</p><h2>Next Steps</h2><p>After setting up your first project, explore our knowledge base for detailed guides on advanced features, or contact our support team if you need personalized assistance.</p>',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    category: 'Tutorials',
    tags: ['Getting Started', 'Setup', 'Tutorial'],
    date: '2023-06-15',
    readTime: '5 min read',
    author: 'Alex Johnson',
    featured: true,
    translations: {
      fr: {
        title: 'Premiers pas avec notre plateforme',
        excerpt: 'Un guide complet pour vous aider à démarrer avec nos solutions d\'entreprise.',
        content: '<p>Bienvenue sur notre plateforme ! Ce guide vous guidera à travers les étapes essentielles pour commencer et tirer le meilleur parti de nos fonctionnalités.</p>'
      },
      es: {
        title: 'Empezando con nuestra plataforma',
        excerpt: 'Una guía completa para ayudarte a comenzar con nuestras soluciones empresariales.',
        content: '<p>¡Bienvenido a nuestra plataforma! Esta guía lo guiará a través de los pasos esenciales para comenzar y aprovechar al máximo nuestras características.</p>'
      }
    }
  },
  {
    id: '2',
    title: 'Mastering React Hooks',
    slug: 'mastering-react-hooks',
    excerpt: 'Learn how to use React hooks to manage state and side effects in your functional components.',
    content: '<p>React hooks are a powerful tool for managing state and side effects in your functional components. In this guide, we\'ll explore the most commonly used hooks and how to use them effectively.</p><h2>useState</h2><p>The <code>useState</code> hook allows you to add state to your functional components. It returns an array with two elements: the current state value and a function to update it.</p><h2>useEffect</h2><p>The <code>useEffect</code> hook allows you to perform side effects in your functional components. It takes a function that will be executed after the component renders.</p><h2>useContext</h2><p>The <code>useContext</code> hook allows you to access the value of a context object in your functional components.</p><h2>useReducer</h2><p>The <code>useReducer</code> hook is an alternative to <code>useState</code> that is useful for managing complex state logic.</p><h2>Custom Hooks</h2><p>You can also create your own custom hooks to encapsulate reusable stateful logic.</p>',
    image: 'https://images.unsplash.com/photo-1579403124614-197f69d81e3b?w=800',
    category: 'React',
    tags: ['React', 'Hooks', 'JavaScript'],
    date: '2023-07-01',
    readTime: '8 min read',
    author: 'Emily Davis',
    featured: false,
    translations: {
      fr: {
        title: 'Maîtriser les hooks React',
        excerpt: 'Apprenez à utiliser les hooks React pour gérer l\'état et les effets secondaires dans vos composants fonctionnels.',
        content: '<p>Les hooks React sont un outil puissant pour gérer l\'état et les effets secondaires dans vos composants fonctionnels. Dans ce guide, nous explorerons les hooks les plus couramment utilisés et comment les utiliser efficacement.</p>'
      },
      es: {
        title: 'Dominar los hooks de React',
        excerpt: 'Aprenda a usar los hooks de React para administrar el estado y los efectos secundarios en sus componentes funcionales.',
        content: '<p>Los hooks de React son una herramienta poderosa para administrar el estado y los efectos secundarios en sus componentes funcionales. En esta guía, exploraremos los hooks más utilizados y cómo usarlos de manera efectiva.</p>'
      }
    }
  },
  {
    id: '3',
    title: 'The Future of Web Development',
    slug: 'the-future-of-web-development',
    excerpt: 'An overview of the latest trends and technologies shaping the future of web development.',
    content: '<p>Web development is constantly evolving, and it\'s important to stay up-to-date with the latest trends and technologies. In this article, we\'ll take a look at some of the most exciting developments in the field.</p><h2>Serverless Architecture</h2><p>Serverless architecture is a cloud computing execution model in which the cloud provider dynamically manages the allocation of machine resources. This allows developers to focus on writing code without worrying about server management.</p><h2>Progressive Web Apps (PWAs)</h2><p>Progressive Web Apps are web applications that are designed to work offline and provide a native app-like experience. They are built using web technologies like HTML, CSS, and JavaScript, but can be installed on users\' devices and accessed like native apps.</p><h2>WebAssembly</h2><p>WebAssembly is a binary instruction format for a stack-based virtual machine. It is designed to be a portable target for compilation of high-level languages like C, C++, and Rust, enabling near-native performance in web browsers.</p><h2>AI and Machine Learning</h2><p>AI and machine learning are increasingly being used in web development to automate tasks, personalize user experiences, and improve website performance.</p>',
    image: 'https://images.unsplash.com/photo-1519389950473-47a04ca0ecd8?w=800',
    category: 'Web Development',
    tags: ['Web Development', 'Trends', 'Technology'],
    date: '2023-07-15',
    readTime: '10 min read',
    author: 'David Smith',
    featured: true,
    translations: {
      fr: {
        title: 'L\'avenir du développement web',
        excerpt: 'Un aperçu des dernières tendances et technologies qui façonnent l\'avenir du développement web.',
        content: '<p>Le développement web est en constante évolution, et il est important de se tenir au courant des dernières tendances et technologies. Dans cet article, nous examinerons certains des développements les plus intéressants dans le domaine.</p>'
      },
      es: {
        title: 'El futuro del desarrollo web',
        excerpt: 'Una descripción general de las últimas tendencias y tecnologías que dan forma al futuro del desarrollo web.',
        content: '<p>El desarrollo web está en constante evolución, y es importante mantenerse al día con las últimas tendencias y tecnologías. En este artículo, echaremos un vistazo a algunos de los desarrollos más interesantes en el campo.</p>'
      }
    }
  }
];

// Get all blog posts
export const getBlogPosts = (): BlogPost[] => {
  return blogPosts;
};

// Get a single blog post by ID
export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

// Get a single blog post by slug
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

// Create a new blog post
export const createBlogPost = async (postData: any): Promise<BlogPost> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate translations for the new post
  const translations = await generateTranslations(
    postData.title,
    postData.excerpt,
    postData.content
  );
  
  const newPost: BlogPost = {
    id: uuidv4(),
    title: postData.title,
    slug: postData.slug,
    excerpt: postData.excerpt,
    content: postData.content,
    image: postData.image,
    category: postData.category,
    tags: postData.tags,
    date: postData.date,
    readTime: postData.readTime,
    author: postData.author,
    featured: postData.featured || false,
    translations: postData.translations || translations
  };
  
  blogPosts.push(newPost);
  return newPost;
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: any): Promise<BlogPost | undefined> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = blogPosts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return undefined;
  }
  
  // Generate new translations if not provided manually
  let translations = postData.translations;
  
  if (!translations) {
    translations = await generateTranslations(
      postData.title,
      postData.excerpt,
      postData.content
    );
  }
  
  const updatedPost: BlogPost = {
    ...blogPosts[index],
    ...postData,
    translations
  };
  
  blogPosts[index] = updatedPost;
  return updatedPost;
};

// Delete a blog post
export const deleteBlogPost = (id: string): boolean => {
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(post => post.id !== id);
  return blogPosts.length < initialLength;
};

// Get featured posts
export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured).slice(0, 3);
};

// Get posts by category
export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

// Search posts
export const searchPosts = (query: string): BlogPost[] => {
  const searchTerm = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) || 
    post.content.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};
