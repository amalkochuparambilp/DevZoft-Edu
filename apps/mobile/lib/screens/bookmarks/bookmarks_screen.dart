import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/resource.dart';
import '../../providers/providers.dart';
import '../../widgets/app_shell.dart';
import '../../widgets/resource_card.dart';
import '../../core/supabase_client.dart';

class BookmarksScreen extends ConsumerStatefulWidget {
  const BookmarksScreen({super.key});

  @override
  ConsumerState<BookmarksScreen> createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends ConsumerState<BookmarksScreen> {
  List<Resource> _items = [];
  Object? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final user = SupabaseClientProvider.client.auth.currentUser;
    if (user == null) {
      setState(() => _loading = false);
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final items = await ref
          .read(bookmarkRepositoryProvider)
          .getBookmarkedResources(user.id);
      if (mounted) setState(() => _items = items);
    } catch (error) {
      if (mounted) setState(() => _error = error);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = SupabaseClientProvider.client.auth.currentUser;
    return AppShell(
      title: 'Saved resources',
      selectedIndex: 2,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 32, 24, 36),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1120),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Keep your favorites close.',
                  style: TextStyle(
                    color: appInk,
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.8,
                  ),
                ),
                const SizedBox(height: 7),
                const Text(
                  'Your saved learning materials, all in one place.',
                  style: TextStyle(color: appMuted, fontSize: 14),
                ),
                const SizedBox(height: 24),
                if (user == null)
                  _BookmarkMessage(
                    icon: Icons.lock_outline_rounded,
                    title: 'Sign in to see your saved resources',
                    message:
                        'Create a free account or sign in to keep your favorites synced.',
                    action: FilledButton(
                      onPressed: () => context.go('/login'),
                      child: const Text('Sign in'),
                    ),
                  )
                else if (_loading)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 50),
                    child: Center(
                      child: CircularProgressIndicator(color: appBlue),
                    ),
                  )
                else if (_error != null)
                  _BookmarkMessage(
                    icon: Icons.cloud_off_outlined,
                    title: 'Could not load your saved resources',
                    message: _error.toString(),
                    action: TextButton(
                      onPressed: _load,
                      child: const Text('Try again'),
                    ),
                  )
                else if (_items.isEmpty)
                  _BookmarkMessage(
                    icon: Icons.bookmark_border_rounded,
                    title: 'Your saved list is ready',
                    message:
                        'Browse the library and save resources to find them here later.',
                    action: OutlinedButton(
                      onPressed: () => context.go('/resources'),
                      child: const Text('Explore resources'),
                    ),
                  )
                else
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final columns = constraints.maxWidth >= 850
                          ? 3
                          : constraints.maxWidth >= 540
                              ? 2
                              : 1;
                      const gap = 16.0;
                      final width =
                          (constraints.maxWidth - gap * (columns - 1)) /
                              columns;
                      return Wrap(
                        spacing: gap,
                        runSpacing: gap,
                        children: _items
                            .map((resource) => SizedBox(
                                  width: width,
                                  child: ResourceCard(resource: resource),
                                ))
                            .toList(),
                      );
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BookmarkMessage extends StatelessWidget {
  const _BookmarkMessage({
    required this.icon,
    required this.title,
    required this.message,
    required this.action,
  });

  final IconData icon;
  final String title;
  final String message;
  final Widget action;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE8ECF3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: appBlue, size: 38),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              color: appInk,
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: appMuted, fontSize: 13),
          ),
          const SizedBox(height: 10),
          action,
        ],
      ),
    );
  }
}
