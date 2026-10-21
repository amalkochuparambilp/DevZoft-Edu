import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

const appInk = Color(0xFF172B4D);
const appMuted = Color(0xFF6B7A90);
const appCanvas = Color(0xFFF6F8FC);
const appBlue = Color(0xFF3F63F5);

class AppShell extends StatelessWidget {
  const AppShell({
    required this.title,
    required this.selectedIndex,
    required this.child,
    super.key,
  });

  final String title;
  final int selectedIndex;
  final Widget child;

  static const _destinations = [
    (label: 'Home', icon: Icons.grid_view_rounded, path: '/'),
    (label: 'Explore', icon: Icons.auto_stories_rounded, path: '/resources'),
    (label: 'Saved', icon: Icons.bookmark_border_rounded, path: '/bookmarks'),
  ];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final wide = constraints.maxWidth >= 820;
        return Scaffold(
          backgroundColor: appCanvas,
          body: SafeArea(
            child: Row(
              children: [
                if (wide) _Sidebar(selectedIndex: selectedIndex),
                Expanded(
                  child: Column(
                    children: [
                      _Header(title: title, wide: wide),
                      Expanded(child: child),
                    ],
                  ),
                ),
              ],
            ),
          ),
          bottomNavigationBar: wide
              ? null
              : NavigationBar(
                  selectedIndex: selectedIndex,
                  onDestinationSelected: (index) =>
                      context.go(_destinations[index].path),
                  destinations: [
                    for (final destination in _destinations)
                      NavigationDestination(
                        icon: Icon(destination.icon),
                        label: destination.label,
                      ),
                  ],
                ),
        );
      },
    );
  }
}

class _Sidebar extends StatelessWidget {
  const _Sidebar({required this.selectedIndex});

  final int selectedIndex;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 248,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(right: BorderSide(color: Color(0xFFE8ECF3))),
      ),
      padding: const EdgeInsets.fromLTRB(20, 24, 16, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: appBlue,
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Icon(Icons.auto_awesome, color: Colors.white),
              ),
              const SizedBox(width: 11),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DevZoft',
                    style: TextStyle(
                      color: appInk,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
                  ),
                  Text(
                    'LEARNING',
                    style: TextStyle(
                      color: appMuted,
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.7,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 42),
          const Padding(
            padding: EdgeInsets.only(left: 12, bottom: 12),
            child: Text(
              'YOUR SPACE',
              style: TextStyle(
                color: appMuted,
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.3,
              ),
            ),
          ),
          ...AppShell._destinations.indexed.map((entry) {
            final (index, destination) = entry;
            final selected = index == selectedIndex;
            return Padding(
              padding: const EdgeInsets.only(bottom: 5),
              child: ListTile(
                dense: true,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                selected: selected,
                selectedTileColor: const Color(0xFFEEF1FF),
                leading: Icon(
                  destination.icon,
                  color: selected ? appBlue : appMuted,
                  size: 21,
                ),
                title: Text(
                  destination.label,
                  style: TextStyle(
                    color: selected ? appBlue : appInk,
                    fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
                onTap: () => context.go(destination.path),
              ),
            );
          }),
          const Spacer(),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF4F6FF),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.lightbulb_outline_rounded, color: appBlue),
                SizedBox(height: 8),
                Text(
                  'Small steps add up.',
                  style: TextStyle(
                    color: appInk,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  'Keep learning at your own pace.',
                  style: TextStyle(color: appMuted, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.title, required this.wide});

  final String title;
  final bool wide;

  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;
    return Container(
      height: 72,
      padding: EdgeInsets.symmetric(horizontal: wide ? 36 : 20),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE8ECF3))),
      ),
      child: Row(
        children: [
          if (!wide) ...[
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: appBlue,
                borderRadius: BorderRadius.circular(11),
              ),
              child: const Icon(
                Icons.auto_awesome,
                color: Colors.white,
                size: 19,
              ),
            ),
            const SizedBox(width: 11),
          ],
          Text(
            title,
            style: const TextStyle(
              color: appInk,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
          const Spacer(),
          if (user == null)
            TextButton.icon(
              onPressed: () => context.go('/login'),
              icon: const Icon(Icons.login_rounded, size: 18),
              label: const Text('Sign in'),
            )
          else
            CircleAvatar(
              radius: 17,
              backgroundColor: const Color(0xFFEEF1FF),
              child: Text(
                (user.email?.isNotEmpty ?? false)
                    ? user.email![0].toUpperCase()
                    : 'L',
                style: const TextStyle(
                  color: appBlue,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
