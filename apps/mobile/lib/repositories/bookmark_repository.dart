import '../core/supabase_client.dart';

class BookmarkRepository {
  final _client = SupabaseClientProvider.client;

  Future<List<String>> getBookmarkedResourceIds(String userId) async {
    final res = await _client.from('bookmarks').select('resource_id').eq('user_id', userId);
    return (res as List).map((e) => e['resource_id'] as String).toList();
  }

  Future<void> addBookmark(String userId, String resourceId) async {
    await _client.from('bookmarks').insert({'user_id': userId, 'resource_id': resourceId});
  }

  Future<void> removeBookmark(String userId, String resourceId) async {
    await _client.from('bookmarks').delete().eq('user_id', userId).eq('resource_id', resourceId);
  }
}
