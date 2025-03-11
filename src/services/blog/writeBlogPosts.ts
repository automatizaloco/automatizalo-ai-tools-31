
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { transformDatabasePost, transformPostForDatabase } from "./utils";

// Check authentication status
const checkAuth = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("User must be authenticated to perform this operation");
  }
};

// Create a new blog post
export const createBlogPost = async (postData: any): Promise<BlogPost> => {
  await checkAuth();
  
  console.log("Creating blog post with data:", postData);
  
  const { translations, ...blogPostData } = postData;
  const supabaseData = transformPostForDatabase(blogPostData);
  
  console.log("Prepared data for Supabase:", supabaseData);
  
  // Insert blog post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .insert([supabaseData])
    .select()
    .single();

  if (postError) {
    console.error("Error creating blog post:", postError);
    throw postError;
  }

  console.log("Blog post created:", post);

  // Insert translations if provided
  if (translations) {
    await insertTranslations(post.id, translations);
  }

  return transformDatabasePost(post);
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: any): Promise<BlogPost | undefined> => {
  await checkAuth();
  
  console.log("Updating blog post with data:", postData);
  
  const { translations, ...blogPostData } = postData;
  const supabaseData = transformPostForDatabase(blogPostData);
  
  console.log("Prepared data for Supabase:", supabaseData);
  
  // Update blog post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .update(supabaseData)
    .eq('id', id)
    .select()
    .single();

  if (postError) {
    console.error("Error updating blog post:", postError);
    throw postError;
  }

  console.log("Blog post updated:", post);

  // Update translations
  if (translations) {
    await updateTranslations(id, translations);
  }

  return transformDatabasePost(post);
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  await checkAuth();
  
  console.log("Deleting blog post:", id);
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
  
  console.log("Blog post deleted successfully");
  return true;
};

// Helper function to insert translations
const insertTranslations = async (postId: string, translations: any) => {
  const translationsArray = Object.entries(translations)
    .filter(([language, content]: [string, any]) => 
      content && (content.title || content.excerpt || content.content))
    .map(([language, content]: [string, any]) => ({
      blog_post_id: postId,
      language,
      title: content.title || "",
      excerpt: content.excerpt || "",
      content: content.content || ""
    }));

  if (translationsArray.length > 0) {
    console.log("Inserting translations:", translationsArray);
    
    const { error: translationError } = await supabase
      .from('blog_translations')
      .insert(translationsArray);

    if (translationError) {
      console.error("Error inserting translations:", translationError);
      throw translationError;
    }
  }
};

// Helper function to update translations
const updateTranslations = async (postId: string, translations: any) => {
  // Delete existing translations
  const { error: deleteError } = await supabase
    .from('blog_translations')
    .delete()
    .eq('blog_post_id', postId);

  if (deleteError) {
    console.error("Error deleting existing translations:", deleteError);
    throw deleteError;
  }

  // Insert new translations
  await insertTranslations(postId, translations);
};
