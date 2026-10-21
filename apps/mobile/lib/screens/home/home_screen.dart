import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/resource.dart';
import '../../providers/providers.dart';
import '../../widgets/app_shell.dart';
import '../../widgets/resource_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  List<Resource> _featured = [];
  Object? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final featured = await ref.read(resourceRepositoryProvider).featured();
      if (mounted) setState(() => _featured = featured);
    } catch (error) {
      if (mounted) setState(() => _error = error);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Discover',
      selectedIndex: 0,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final horizontalPadding = constraints.maxWidth < 600 ? 20.0 : 40.0;
          return SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(
                horizontalPadding, 28, horizontalPadding, 36),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1160),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _Hero(onExplore: () => context.go('/resources')),
                    const SizedBox(height: 34),
                    Row(
                      children: [
                        const Expanded(
                            child: _SectionHeading(
                          eyebrow: 'FIND YOUR NEXT STEP',
                          title: 'Explore by interest',
                        )),
                        TextButton(
                          onPressed: () => context.go('/resources'),
                          child: const Text('Browse all'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    LayoutBuilder(
                      builder: (context, categoryConstraints) {
                        final columns = categoryConstraints.maxWidth >= 760
                            ? 4
                            : categoryConstraints.maxWidth >= 470
                                ? 2
                                : 1;
                        const gap = 12.0;
                        final width = (categoryConstraints.maxWidth -
                                gap * (columns - 1)) /
                            columns;
                        return Wrap(
                          spacing: gap,
                          runSpacing: gap,
                          children: [
                            _InterestCard(
                              width: width,
                              type: 'notes',
                              icon: Icons.edit_note_rounded,
                              title: 'Study notes',
                              subtitle: 'Clear, focused learning',
                              color: const Color(0xFFEAF0FF),
                            ),
                            _InterestCard(
                              width: width,
                              type: 'video',
                              icon: Icons.play_circle_outline_rounded,
                              title: 'Video lessons',
                              subtitle: 'Learn by watching',
                              color: const Color(0xFFE6F7F1),
                            ),
                            _InterestCard(
                              width: width,
                              type: 'question_paper',
                              icon: Icons.assignment_outlined,
                              title: 'Past papers',
                              subtitle: 'Practice with confidence',
                              color: const Color(0xFFFFF2E2),
                            ),
                            _InterestCard(
                              width: width,
                              type: 'article',
                              icon: Icons.article_outlined,
                              title: 'Articles',
                              subtitle: 'Ideas worth exploring',
                              color: const Color(0xFFF3EAFE),
                            ),
                          ],
                        );
                      },
                    ),
                    const SizedBox(height: 36),
                    Row(
                      children: [
                        const Expanded(
                            child: _SectionHeading(
                          eyebrow: 'HAND-PICKED FOR YOU',
                          title: 'Featured resources',
                        )),
                        TextButton(
                          onPressed: () => context.go('/resources'),
                          child: const Text('See all'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (_loading)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 36),
                        child: Center(
                          child: CircularProgressIndicator(color: appBlue),
                        ),
                      )
                    else if (_error != null)
                      _InlineError(error: _error!, onRetry: _load)
                    else if (_featured.isEmpty)
                      _EmptyFeatured(onExplore: () => context.go('/resources'))
                    else
                      LayoutBuilder(
                        builder: (context, resourceConstraints) {
                          final columns = resourceConstraints.maxWidth >= 900
                              ? 3
                              : resourceConstraints.maxWidth >= 570
                                  ? 2
                                  : 1;
                          const gap = 16.0;
                          final width = (resourceConstraints.maxWidth -
                                  gap * (columns - 1)) /
                              columns;
                          return Wrap(
                            spacing: gap,
                            runSpacing: gap,
                            children: _featured
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
          );
        },
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero({required this.onExplore});

  final VoidCallback onExplore;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final compact = constraints.maxWidth < 600;
        return Container(
          width: double.infinity,
          padding: EdgeInsets.all(compact ? 24 : 40),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF243FAD), Color(0xFF526EF4)],
              begin: Alignment.centerLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(26),
          ),
          child: Row(
            children: [
              Expanded(
                flex: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 11,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.14),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Text(
                        'YOUR LEARNING JOURNEY STARTS HERE',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.1,
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Curiosity looks\ngood on you.',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: compact ? 32 : 43,
                        height: 1.08,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -1.4,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Discover helpful resources, learn something new, and make progress one day at a time.',
                      style: TextStyle(
                        color: Color(0xFFE0E7FF),
                        fontSize: 14,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 23),
                    FilledButton.icon(
                      onPressed: onExplore,
                      style: FilledButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF304DBE),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 19,
                          vertical: 16,
                        ),
                      ),
                      icon: const Icon(Icons.explore_outlined, size: 19),
                      label: const Text(
                        'Explore resources',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ),
              if (!compact) ...[
                const SizedBox(width: 20),
                const Expanded(
                  flex: 2,
                  child: Center(child: _LearningIllustration()),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}

class _LearningIllustration extends StatelessWidget {
  const _LearningIllustration();

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 280, maxHeight: 220),
      height: 220,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned(
            top: 27,
            right: 35,
            child: Icon(
              Icons.auto_awesome,
              color: Colors.white.withValues(alpha: 0.75),
              size: 25,
            ),
          ),
          Positioned(
            left: 37,
            bottom: 31,
            child: Icon(
              Icons.circle,
              color: Colors.white.withValues(alpha: 0.5),
              size: 10,
            ),
          ),
          const Icon(
            Icons.menu_book_rounded,
            color: Colors.white,
            size: 106,
          ),
        ],
      ),
    );
  }
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({required this.eyebrow, required this.title});

  final String eyebrow;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          eyebrow,
          style: const TextStyle(
            color: appBlue,
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.3,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          title,
          style: const TextStyle(
            color: appInk,
            fontSize: 21,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.4,
          ),
        ),
      ],
    );
  }
}

class _InterestCard extends StatelessWidget {
  const _InterestCard({
    required this.width,
    required this.type,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
  });

  final double width;
  final String type;
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        child: InkWell(
          onTap: () => context.go('/resources?type=$type'),
          borderRadius: BorderRadius.circular(17),
          child: Container(
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(17),
              border: Border.all(color: const Color(0xFFE8ECF3)),
            ),
            child: Row(
              children: [
                Container(
                  width: 43,
                  height: 43,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(13),
                  ),
                  child: Icon(icon, color: appInk, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: appInk,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(color: appMuted, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _InlineError extends StatelessWidget {
  const _InlineError({required this.error, required this.onRetry});

  final Object error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFD8D8)),
      ),
      child: Row(
        children: [
          const Icon(Icons.cloud_off_outlined, color: Color(0xFFCB4242)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Featured resources could not be loaded. $error',
              style: const TextStyle(color: appInk, fontSize: 13),
            ),
          ),
          TextButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}

class _EmptyFeatured extends StatelessWidget {
  const _EmptyFeatured({required this.onExplore});

  final VoidCallback onExplore;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE8ECF3)),
      ),
      child: Column(
        children: [
          const Icon(Icons.auto_stories_outlined, color: appBlue, size: 34),
          const SizedBox(height: 9),
          const Text(
            'Your next favorite resource is waiting.',
            style: TextStyle(color: appInk, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 5),
          const Text(
            'Explore the library and find something that inspires you.',
            textAlign: TextAlign.center,
            style: TextStyle(color: appMuted, fontSize: 13),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: onExplore,
            child: const Text('Explore library'),
          ),
        ],
      ),
    );
  }
}
