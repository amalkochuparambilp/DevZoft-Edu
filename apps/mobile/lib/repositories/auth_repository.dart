import 'package:supabase_flutter/supabase_flutter.dart';
import '../core/supabase_client.dart';

class AuthRepository {
  SupabaseClient get _client => SupabaseClientProvider.client;

  Future<AuthResponse> signUp(
    String email,
    String password, {
    String? displayName,
  }) =>
      _client.auth.signUp(
        email: email,
        password: password,
        data: {'display_name': displayName},
      );

  Future<AuthResponse> signIn(String email, String password) =>
      _client.auth.signInWithPassword(email: email, password: password);

  Future<void> signOut() => _client.auth.signOut();

  Future<void> resetPassword(String email) =>
      _client.auth.resetPasswordForEmail(email);

  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;
}
