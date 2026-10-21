import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../models/resource.dart';
import '../routing/app_router.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});
  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  List<Resource> _featured = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final repo = ref.read(resourceRepositoryProvider);
    final f = await repo.featured();
    if (mounted) setState(() { _featured = f; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('DevZoft Learning')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const Text('Featured Resources', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                ..._featured.map((r) => ListTile(
                      title: Text(r.title),
                      subtitle: Text(r.resourceType),
                      onTap: () => context.go('/resources/${r.id}'),
                    )),
                const SizedBox(height: 16),
                FilledButton(onPressed: () => context.go('/resources'), child: const Text('Browse Resources')),
                FilledButton(onPressed: () => context.go('/bookmarks'), child: const Text('Bookmarks')),
              ],
            ),
    );
  }
}
