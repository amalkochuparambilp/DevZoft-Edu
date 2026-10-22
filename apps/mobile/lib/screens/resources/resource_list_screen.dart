import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/resource.dart';
import '../../providers/providers.dart';
import '../../widgets/app_shell.dart';
import '../../widgets/resource_card.dart';

class ResourceListScreen extends ConsumerStatefulWidget {
  const ResourceListScreen({this.initialType, super.key});

  final String? initialType;

  @override
  ConsumerState<ResourceListScreen> createState() => _ResourceListScreenState();
}

class _ResourceListScreenState extends ConsumerState<ResourceListScreen> {
  final _search = TextEditingController();
  static const _types = [
    ('All resources', ''),
    ('Articles', 'article'),
    ('PDFs', 'pdf'),
    ('Notes', 'notes'),
    ('Books', 'ebook'),
    ('Videos', 'video'),
    ('Audio', 'audio'),
    ('Worksheets', 'worksheet'),
    ('Past papers', 'question_paper'),
    ('External links', 'external_link'),
  ];

  List<Resource> _items = [];
  Object? _error;
  late String _selectedType;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _selectedType = _types.any((type) => type.$2 == widget.initialType)
        ? widget.initialType!
        : '';
    _load();
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final items = await ref.read(resourceRepositoryProvider).listResources(
            query: _search.text.trim(),
            resourceType: _selectedType,
          );
      if (mounted) setState(() => _items = items);
    } catch (error) {
      if (mounted) setState(() => _error = error);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Explore',
      selectedIndex: 1,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final horizontalPadding = constraints.maxWidth < 600 ? 20.0 : 40.0;
          return SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(
                horizontalPadding, 30, horizontalPadding, 36),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1160),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'The learning library',
                      style: TextStyle(
                        color: appInk,
                        fontSize: 30,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -1,
                      ),
                    ),
                    const SizedBox(height: 7),
                    const Text(
                      'Find clear, useful materials to help you learn at your own pace.',
                      style: TextStyle(color: appMuted, fontSize: 14),
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _search,
                      textInputAction: TextInputAction.search,
                      onSubmitted: (_) => _load(),
                      decoration: InputDecoration(
                        hintText: 'Search resources...',
                        prefixIcon: const Icon(Icons.search_rounded),
                        suffixIcon: IconButton(
                          tooltip: 'Search',
                          onPressed: _load,
                          icon: const Icon(Icons.arrow_forward_rounded),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding:
                            const EdgeInsets.symmetric(vertical: 17),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide:
                              const BorderSide(color: Color(0xFFE3E8F0)),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide:
                              const BorderSide(color: Color(0xFFE3E8F0)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 17),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _types.map((type) {
                        final selected = _selectedType == type.$2;
                        return ChoiceChip(
                          label: Text(type.$1),
                          selected: selected,
                          showCheckmark: false,
                          onSelected: (_) {
                            setState(() => _selectedType = type.$2);
                            _load();
                          },
                          labelStyle: TextStyle(
                            color: selected ? Colors.white : appMuted,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                          selectedColor: appBlue,
                          backgroundColor: Colors.white,
                          side: BorderSide(
                            color: selected ? appBlue : const Color(0xFFE3E8F0),
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 25),
                    Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Browse resources',
                            style: TextStyle(
                              color: appInk,
                              fontWeight: FontWeight.w700,
                              fontSize: 17,
                            ),
                          ),
                        ),
                        if (!_loading && _error == null)
                          Text(
                            '${_items.length} ${_items.length == 1 ? 'resource' : 'resources'}',
                            style:
                                const TextStyle(color: appMuted, fontSize: 12),
                          ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    if (_loading)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 48),
                        child: Center(
                          child: CircularProgressIndicator(color: appBlue),
                        ),
                      )
                    else if (_error != null)
                      _ResourceError(error: _error!, onRetry: _load)
                    else if (_items.isEmpty)
                      const _NoResources()
                    else
                      LayoutBuilder(
                        builder: (context, gridConstraints) {
                          final columns = gridConstraints.maxWidth >= 900
                              ? 3
                              : gridConstraints.maxWidth >= 570
                                  ? 2
                                  : 1;
                          const gap = 16.0;
                          final width =
                              (gridConstraints.maxWidth - gap * (columns - 1)) /
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
          );
        },
      ),
    );
  }
}

class _ResourceError extends StatelessWidget {
  const _ResourceError({required this.error, required this.onRetry});

  final Object error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return _MessagePanel(
      icon: Icons.cloud_off_outlined,
      title: 'We could not load the library',
      message: error.toString(),
      action: TextButton(onPressed: onRetry, child: const Text('Try again')),
    );
  }
}

class _NoResources extends StatelessWidget {
  const _NoResources();

  @override
  Widget build(BuildContext context) {
    return const _MessagePanel(
      icon: Icons.search_off_rounded,
      title: 'No resources found',
      message: 'Try another search or choose a different category.',
    );
  }
}

class _MessagePanel extends StatelessWidget {
  const _MessagePanel({
    required this.icon,
    required this.title,
    required this.message,
    this.action,
  });

  final IconData icon;
  final String title;
  final String message;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE8ECF3)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 36, color: appBlue),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              color: appInk,
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: appMuted, fontSize: 13),
          ),
          if (action != null) ...[const SizedBox(height: 8), action!],
        ],
      ),
    );
  }
}
