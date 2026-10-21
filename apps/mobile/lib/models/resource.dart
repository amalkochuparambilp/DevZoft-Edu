class Resource {
  final String id;
  final String title;
  final String? description;
  final String resourceType;
  final String status;
  final bool featured;
  final String? thumbnailUrl;
  final String? fileUrl;
  final String? externalUrl;
  final String? language;
  final DateTime? publishedAt;

  Resource({
    required this.id,
    required this.title,
    this.description,
    required this.resourceType,
    required this.status,
    this.featured = false,
    this.thumbnailUrl,
    this.fileUrl,
    this.externalUrl,
    this.language,
    this.publishedAt,
  });

  factory Resource.fromJson(Map<String, dynamic> json) => Resource(
        id: json['id'] as String,
        title: json['title'] as String,
        description: json['description'] as String?,
        resourceType: (json['resource_type'] ?? 'article') as String,
        status: (json['status'] ?? 'draft') as String,
        featured: (json['featured'] ?? false) as bool,
        thumbnailUrl: json['thumbnail_url'] as String?,
        fileUrl: json['file_url'] as String?,
        externalUrl: json['external_url'] as String?,
        language: json['language'] as String?,
        publishedAt: json['published_at'] != null ? DateTime.parse(json['published_at'] as String) : null,
      );
}
