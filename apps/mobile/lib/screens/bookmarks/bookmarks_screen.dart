import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BookmarksScreen extends StatelessWidget {
  const BookmarksScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bookmarks')),
      body: const Center(child: Text('Bookmarks sync with your account.')),
    );
  }
}
