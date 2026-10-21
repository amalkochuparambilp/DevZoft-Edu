import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:devzoft_learning/routing/app_router.dart';
import 'package:devzoft_learning/widgets/app_shell.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  const supabasePublishableKey =
      String.fromEnvironment('SUPABASE_PUBLISHABLE_KEY');
  if (supabaseUrl.isEmpty || supabasePublishableKey.isEmpty) {
    throw StateError(
      'Missing Supabase configuration. Provide SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY with --dart-define.',
    );
  }
  await Supabase.initialize(
    url: supabaseUrl,
    publishableKey: supabasePublishableKey,
  );
  runApp(const ProviderScope(child: DevZoftApp()));
}

class DevZoftApp extends ConsumerWidget {
  const DevZoftApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    return MaterialApp.router(
      title: 'DevZoft Learning',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: appBlue,
          primary: appBlue,
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: appCanvas,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: appInk,
          elevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 15,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(13),
            borderSide: const BorderSide(color: Color(0xFFE3E8F0)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(13),
            borderSide: const BorderSide(color: Color(0xFFE3E8F0)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(13),
            borderSide: const BorderSide(color: appBlue, width: 1.5),
          ),
        ),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}
