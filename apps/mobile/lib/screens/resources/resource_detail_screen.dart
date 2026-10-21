import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../models/resource.dart';

class ResourceDetailScreen extends ConsumerStatefulWidget {
  final String id;
  const ResourceDetailScreen({super.key, required this.id});
  @override
  ConsumerState<ResourceDetailScreen> createState() => _ResourceDetailScreenState();
}

class _ResourceDetailScreenState extends ConsumerState<ResourceDetailScreen> {
  Resource? _resource;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final r = await ref.read(resourceRepositoryProvider).getResource(widget.id);
    if (mounted) setState(() { _resource = r; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    final r = _resource;
    if (r == null) return const Scaffold(body: Center(child: Text('Not found')));
    return Scaffold(
      appBar: AppBar(title: Text(r.title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(r.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(r.description ?? ''),
            const SizedBox(height: 16),
            if (r.fileUrl != null)
              FilledButton(onPressed: () {}, child: const Text('Download')),
            if (r.externalUrl != null)
              FilledButton(onPressed: () {}, child: const Text('Open Link')),
          ],
        ),
      ),
    );
  }
}
