import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/supabase_client.dart';
import '../../models/resource.dart';
import '../../providers/providers.dart';
import '../../widgets/app_shell.dart';

class ResourceDetailScreen extends ConsumerStatefulWidget {
  final String id;

  const ResourceDetailScreen({super.key, required this.id});

  @override
  ConsumerState<ResourceDetailScreen> createState() =>
      _ResourceDetailScreenState();
}

class _ResourceDetailScreenState extends ConsumerState<ResourceDetailScreen> {
  Resource? _resource;
  Object? _error;
  bool _loading = true;
  bool _saving = false;
  bool _isSaved = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final resource =
          await ref.read(resourceRepositoryProvider).getResource(widget.id);
      final user = SupabaseClientProvider.client.auth.currentUser;
      final isSaved = user != null &&
          (await ref
                  .read(bookmarkRepositoryProvider)
                  .getBookmarkedResourceIds(user.id))
              .contains(widget.id);
      if (mounted) {
        setState(() {
          _resource = resource;
          _isSaved = isSaved;
        });
      }
    } catch (error) {
      if (mounted) setState(() => _error = error);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleBookmark() async {
    final user = SupabaseClientProvider.client.auth.currentUser;
    if (user == null) {
      context.go('/login');
      return;
    }
    setState(() => _saving = true);
    try {
      final repository = ref.read(bookmarkRepositoryProvider);
      if (_isSaved) {
        await repository.removeBookmark(user.id, widget.id);
      } else {
        await repository.addBookmark(user.id, widget.id);
      }
      if (mounted) setState(() => _isSaved = !_isSaved);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not update saved resources: $error')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _open(String? value) async {
    if (value == null || value.isEmpty) return;
    final uri = Uri.tryParse(value);
    if (uri == null || !uri.hasScheme) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This resource link is not valid.')),
      );
      return;
    }
    try {
      final opened = await launchUrl(uri, mode: LaunchMode.platformDefault);
      if (!opened && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open this resource link.')),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open this resource: $error')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final resource = _resource;
    return AppShell(
      title: 'Resource details',
      selectedIndex: 1,
      child: _loading
          ? const Center(child: CircularProgressIndicator(color: appBlue))
          : _error != null
              ? Center(child: Text('Could not load resource: $_error'))
              : resource == null
                  ? const Center(
                      child: Text('This resource could not be found.'))
                  : _content(resource),
    );
  }

  Widget _content(Resource resource) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final horizontalPadding = constraints.maxWidth < 600 ? 20.0 : 40.0;
        return SingleChildScrollView(
          padding:
              EdgeInsets.fromLTRB(horizontalPadding, 30, horizontalPadding, 36),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 920),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    height: constraints.maxWidth < 600 ? 190 : 260,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFEAF0FF), Color(0xFFE7E9FF)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: resource.thumbnailUrl == null
                        ? const Icon(
                            Icons.menu_book_rounded,
                            color: appBlue,
                            size: 76,
                          )
                        : Image.network(
                            resource.thumbnailUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(
                              Icons.menu_book_rounded,
                              color: appBlue,
                              size: 76,
                            ),
                          ),
                  ),
                  const SizedBox(height: 25),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 11,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF1FF),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Text(
                      resource.resourceType.replaceAll('_', ' ').toUpperCase(),
                      style: const TextStyle(
                        color: appBlue,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.7,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    resource.title,
                    style: const TextStyle(
                      color: appInk,
                      fontSize: 30,
                      height: 1.2,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.8,
                    ),
                  ),
                  if (resource.language?.isNotEmpty ?? false) ...[
                    const SizedBox(height: 8),
                    Text(
                      resource.language!,
                      style: const TextStyle(color: appMuted, fontSize: 13),
                    ),
                  ],
                  const SizedBox(height: 19),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFE8ECF3)),
                    ),
                    child: Text(
                      resource.description?.isNotEmpty == true
                          ? resource.description!
                          : 'No description is available for this resource yet.',
                      style: const TextStyle(
                        color: appMuted,
                        fontSize: 14,
                        height: 1.7,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 12,
                    runSpacing: 10,
                    children: [
                      if (resource.fileUrl != null)
                        FilledButton.icon(
                          onPressed: () => _open(resource.fileUrl),
                          icon: const Icon(Icons.download_rounded, size: 19),
                          label: const Text('Open resource'),
                        ),
                      if (resource.externalUrl != null)
                        OutlinedButton.icon(
                          onPressed: () => _open(resource.externalUrl),
                          icon: const Icon(Icons.open_in_new_rounded, size: 18),
                          label: const Text('Visit link'),
                        ),
                      OutlinedButton.icon(
                        onPressed: _saving ? null : _toggleBookmark,
                        icon: Icon(
                          _isSaved
                              ? Icons.bookmark_rounded
                              : Icons.bookmark_add_outlined,
                          size: 19,
                        ),
                        label: Text(_isSaved ? 'Saved' : 'Save for later'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
