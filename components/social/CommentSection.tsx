import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { formatTimeAgo } from '@/utils/formatters';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  style?: any;
}

export const CommentSection = ({
  comments,
  onAddComment,
  onLikeComment,
  style,
}: CommentSectionProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Comments ({comments.length})</Text>
      
      <View style={styles.commentInput}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          placeholderTextColor={theme.colors.gray[400]}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newComment.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send size={20} color={newComment.trim() ? '#fff' : theme.colors.gray[400]} />
        </TouchableOpacity>
      </View>
      
      {comments.length === 0 ? (
        <Text style={styles.noComments}>Be the first to comment!</Text>
      ) : (
        <View style={styles.commentsList}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={onLikeComment}
              onReply={(text) => onAddComment(text, comment.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (text: string) => void;
  isReply?: boolean;
}

export const CommentItem = ({
  comment,
  onLike,
  onReply,
  isReply = false,
}: CommentItemProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  return (
    <View style={[styles.commentItem, isReply && styles.replyItem]}>
      <View style={styles.commentHeader}>
        {comment.userAvatar ? (
          <Image source={{ uri: comment.userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {comment.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.commentContent}>
          <View style={styles.commentMeta}>
            <Text style={styles.userName}>{comment.userName}</Text>
            <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
          </View>
          
          <Text style={styles.commentText}>{comment.text}</Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onLike(comment.id)}
            >
              <Heart
                size={16}
                color={comment.isLiked ? theme.colors.error : theme.colors.gray[500]}
                fill={comment.isLiked ? theme.colors.error : 'none'}
              />
              <Text
                style={[
                  styles.actionText,
                  comment.isLiked && styles.likedText,
                ]}
              >
                {comment.likes > 0 ? comment.likes : ''} Like
              </Text>
            </TouchableOpacity>
            
            {!isReply && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageCircle size={16} color={theme.colors.gray[500]} />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {showReplyInput && (
            <View style={styles.replyInput}>
              <TextInput
                style={styles.replyTextInput}
                value={replyText}
                onChangeText={setReplyText}
                placeholder={`Reply to ${comment.userName}...`}
                placeholderTextColor={theme.colors.gray[400]}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.replySendButton,
                  !replyText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleReply}
                disabled={!replyText.trim()}
              >
                <Send size={16} color={replyText.trim() ? '#fff' : theme.colors.gray[400]} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesList}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              isReply
            />
          ))}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    commentInput: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      minHeight: 44,
      borderWidth: 1,
      borderColor: theme.colors.gray[300],
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.colors.text,
      marginRight: 8,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.gray[300],
    },
    noComments: {
      fontSize: 16,
      color: theme.colors.gray[500],
      fontStyle: 'italic',
      textAlign: 'center',
      padding: 20,
    },
    commentsList: {
      marginTop: 8,
    },
    commentItem: {
      marginBottom: 16,
    },
    replyItem: {
      marginLeft: 0,
      marginTop: 12,
      paddingLeft: 0,
    },
    commentHeader: {
      flexDirection: 'row',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarInitial: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    commentContent: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
    },
    commentMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    userName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    commentTime: {
      fontSize: 12,
      color: theme.colors.gray[500],
    },
    commentText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    commentActions: {
      flexDirection: 'row',
      marginTop: 8,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      paddingVertical: 4,
    },
    actionText: {
      fontSize: 12,
      color: theme.colors.gray[500],
      marginLeft: 4,
    },
    likedText: {
      color: theme.colors.error,
    },
    replyInput: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    replyTextInput: {
      flex: 1,
      minHeight: 36,
      borderWidth: 1,
      borderColor: theme.colors.gray[300],
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: theme.colors.text,
      marginRight: 8,
    },
    replySendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    repliesList: {
      marginLeft: 52,
    },
  });

export default CommentSection;