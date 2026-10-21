import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/resource.dart';
import 'app_shell.dart';

class ResourceCard extends StatelessWidget {
  const ResourceCard({required this.resource, super.key});

  final Resource resource;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: Color(0xFFE8ECF3)),
      ),
      child: InkWell(
        onTap: () => context.go('/resources/${resource.id}'),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: 126,
              width: double.infinity,
              child: resource.thumbnailUrl == null
                  ? _Cover(resource: resource)
                  : Image.network(
                      resource.thumbnailUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          _Cover(resource: resource),
                    ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(15, 13, 15, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF1FF),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _label(resource.resourceType),
                      style: const TextStyle(
                        color: appBlue,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(height: 9),
                  Text(
                    resource.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: appInk,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      height: 1.3,
                    ),
                  ),
                  if (resource.description?.isNotEmpty ?? false) ...[
                    const SizedBox(height: 5),
                    Text(
                      resource.description!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: appMuted,
                        fontSize: 12,
                        height: 1.4,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _label(String value) => value
      .split('_')
      .map((word) =>
          word.isEmpty ? word : '${word[0].toUpperCase()}${word.substring(1)}')
      .join(' ');
}

class _Cover extends StatelessWidget {
  const _Cover({required this.resource});

  final Resource resource;

  @override
  Widget build(BuildContext context) {
    final isVideo = resource.resourceType == 'video';
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isVideo
              ? const [Color(0xFFE9F4FF), Color(0xFFDDEAFF)]
              : const [Color(0xFFEDEBFF), Color(0xFFE2E8FF)],
        ),
      ),
      child: Center(
        child: Icon(
          isVideo ? Icons.play_circle_outline_rounded : Icons.menu_book_rounded,
          color: appBlue,
          size: 43,
        ),
      ),
    );
  }
}
