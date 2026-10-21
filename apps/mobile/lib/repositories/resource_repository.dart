import '../core/supabase_client.dart';
import '../models/resource.dart';

class ResourceRepository {
  final _client = SupabaseClientProvider.client;

  Future<List<Resource>> listResources({
    String? query,
    String? status,
    String? resourceType,
    int limit = 20,
    int offset = 0,
  }) async {
    var q = _client.from('resources').select().eq('status', status ?? 'published');
    if (query != null && query.isNotEmpty) {
      q = q.ilike('title', '%$query%');
    }
    if (resourceType != null && resourceType.isNotEmpty) {
      q = q.eq('resource_type', resourceType);
    }
    final res = await q.order('published_at', ascending: false).range(offset, offset + limit - 1);
    return (res as List).map((e) => Resource.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Resource?> getResource(String id) async {
    final res = await _client.from('resources').select().eq('id', id).maybeSingle();
    if (res == null) return null;
    return Resource.fromJson(res);
  }

  Future<List<Resource>> featured() async {
    final res = await _client.from('resources').select().eq('status', 'published').eq('featured', true).limit(10);
    return (res as List).map((e) => Resource.fromJson(e as Map<String, dynamic>)).toList();
  }
}
