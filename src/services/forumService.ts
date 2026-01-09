/**
 * Forum Service
 * 
 * Service layer for community forum operations
 * 
 * TODO: Implement:
 * - Complete CRUD operations for posts and comments
 * - Voting functionality
 * - Real-time updates using Supabase subscriptions
 * - Content moderation integration
 */

import { supabase } from '../lib/supabaseClient';

interface ForumPost {
    id: string;
    user_id: string;
    category_id: string;
    title: string;
    content: string;
    is_anonymous: boolean;
    upvotes: number;
    created_at: string;
}

interface ForumComment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    is_anonymous: boolean;
    upvotes: number;
    created_at: string;
}

export class ForumService {
    /**
     * Get posts for a category
     */
    static async getPosts(
        categoryId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<ForumPost[]> {
        const { data, error } = await supabase
            .from('forum_posts')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    }

    /**
     * Create a new post
     */
    static async createPost(
        categoryId: string,
        title: string,
        content: string,
        isAnonymous: boolean = false
    ): Promise<ForumPost> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('forum_posts')
            .insert({
                user_id: user.id,
                category_id: categoryId,
                title,
                content,
                is_anonymous: isAnonymous,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Get comments for a post
     */
    static async getComments(postId: string): Promise<ForumComment[]> {
        const { data, error } = await supabase
            .from('forum_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * Add a comment to a post
     */
    static async addComment(
        postId: string,
        content: string,
        isAnonymous: boolean = false
    ): Promise<ForumComment> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('forum_comments')
            .insert({
                post_id: postId,
                user_id: user.id,
                content,
                is_anonymous: isAnonymous,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Vote on a post
     */
    static async votePost(postId: string, voteType: 1 | -1): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Upsert vote (insert or update)
        const { error } = await supabase
            .from('forum_votes')
            .upsert({
                user_id: user.id,
                post_id: postId,
                vote_type: voteType,
            });

        if (error) throw error;
    }

    /**
     * Vote on a comment
     */
    static async voteComment(commentId: string, voteType: 1 | -1): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('forum_votes')
            .upsert({
                user_id: user.id,
                comment_id: commentId,
                vote_type: voteType,
            });

        if (error) throw error;
    }

    /**
     * Subscribe to new posts in a category (real-time)
     */
    static subscribeToCategory(
        categoryId: string,
        callback: (post: ForumPost) => void
    ) {
        return supabase
            .channel(`category:${categoryId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'forum_posts',
                    filter: `category_id=eq.${categoryId}`,
                },
                (payload) => callback(payload.new as ForumPost)
            )
            .subscribe();
    }
}

export default ForumService;
