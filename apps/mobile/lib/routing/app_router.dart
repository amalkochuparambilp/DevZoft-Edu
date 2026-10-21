import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/resources/resource_list_screen.dart';
import '../screens/resources/resource_detail_screen.dart';
import '../screens/bookmarks/bookmarks_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(path: '/login', builder: (ctx, st) => const LoginScreen()),
      GoRoute(path: '/register', builder: (ctx, st) => const RegisterScreen()),
      GoRoute(path: '/', builder: (ctx, st) => const HomeScreen()),
      GoRoute(path: '/resources', builder: (ctx, st) => const ResourceListScreen()),
      GoRoute(path: '/resources/:id', builder: (ctx, st) => ResourceDetailScreen(id: st.pathParameters['id']!)),
      GoRoute(path: '/bookmarks', builder: (ctx, st) => const BookmarksScreen()),
    ],
  );
});
