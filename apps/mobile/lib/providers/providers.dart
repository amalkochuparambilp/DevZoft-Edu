import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../repositories/auth_repository.dart';
import '../repositories/resource_repository.dart';
import '../repositories/bookmark_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) => AuthRepository());
final resourceRepositoryProvider = Provider<ResourceRepository>((ref) => ResourceRepository());
final bookmarkRepositoryProvider = Provider<BookmarkRepository>((ref) => BookmarkRepository());

final authStateProvider = StreamProvider((ref) {
  return ref.watch(authRepositoryProvider).authStateChanges;
});
