import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/providers.dart';
import '../../models/resource.dart';

class ResourceListScreen extends ConsumerStatefulWidget {
  const ResourceListScreen({super.key});
  @override
  ConsumerState<ResourceListScreen> createState() => _ResourceListScreenState();
}

class _ResourceListScreenState extends ConsumerState<ResourceListScreen> {
  final _search = TextEditingController();
  List<Resource> _items = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; });
    final repo = ref.read(resourceRepositoryProvider);
    final items = await repo.listResources(query: _search.text);
    if (mounted) setState(() { _items = items; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Resources')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(child: TextField(controller: _search, decoration: const InputDecoration(hintText: 'Search...'))),
                IconButton(onPressed: _load, icon: const Icon(Icons.search)),
              ],
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: _items.length,
                    itemBuilder: (ctx, i) {
                      final r = _items[i];
                      return ListTile(
                        title: Text(r.title),
                        subtitle: Text(r.resourceType),
                        onTap: () => context.go('/resources/${r.id}'),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
