import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/providers.dart';
import '../../widgets/app_shell.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  String? _error;
  bool _loading = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref
          .read(authRepositoryProvider)
          .signIn(_email.text.trim(), _password.text);
      if (mounted) context.go('/');
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _resetPassword() async {
    if (_email.text.trim().isEmpty) {
      setState(() => _error = 'Enter your email address first.');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref.read(authRepositoryProvider).resetPassword(_email.text.trim());
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Password reset email sent.')),
        );
      }
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appCanvas,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 980),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(26),
                      border: Border.all(color: const Color(0xFFE8ECF3)),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x10172B4D),
                          blurRadius: 32,
                          offset: Offset(0, 14),
                        ),
                      ],
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: constraints.maxWidth >= 720
                        ? Row(
                            children: [
                              const Expanded(flex: 5, child: _WelcomePanel()),
                              Expanded(flex: 4, child: _form(context)),
                            ],
                          )
                        : _form(context),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _form(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (MediaQuery.sizeOf(context).width < 720) ...[
            const _Brand(),
            const SizedBox(height: 30),
          ],
          const Text(
            'Welcome back',
            style: TextStyle(
              color: appInk,
              fontSize: 28,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.7,
            ),
          ),
          const SizedBox(height: 7),
          const Text(
            'Sign in to continue your learning journey.',
            style: TextStyle(color: appMuted, fontSize: 14),
          ),
          const SizedBox(height: 27),
          const Text(
            'Email address',
            style: TextStyle(
              color: appInk,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            decoration: const InputDecoration(
              hintText: 'you@example.com',
              prefixIcon: Icon(Icons.mail_outline_rounded),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'Password',
            style: TextStyle(
              color: appInk,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _password,
            obscureText: _obscurePassword,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _loading ? null : _submit(),
            decoration: InputDecoration(
              hintText: 'Enter your password',
              prefixIcon: const Icon(Icons.lock_outline_rounded),
              suffixIcon: IconButton(
                tooltip: _obscurePassword ? 'Show password' : 'Hide password',
                onPressed: () => setState(
                  () => _obscurePassword = !_obscurePassword,
                ),
                icon: Icon(
                  _obscurePassword
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                ),
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: _loading ? null : _resetPassword,
              child: const Text('Forgot password?'),
            ),
          ),
          if (_error != null) ...[
            const SizedBox(height: 4),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF0F0),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _error!,
                style: const TextStyle(color: Color(0xFFB42318), fontSize: 12),
              ),
            ),
            const SizedBox(height: 12),
          ],
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton(
              onPressed: _loading ? null : _submit,
              style: FilledButton.styleFrom(
                backgroundColor: appBlue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _loading
                  ? const SizedBox(
                      width: 19,
                      height: 19,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Text(
                      'Sign in',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
            ),
          ),
          const SizedBox(height: 17),
          Center(
            child: Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                const Text(
                  'New to DevZoft? ',
                  style: TextStyle(color: appMuted, fontSize: 13),
                ),
                TextButton(
                  onPressed: () => context.go('/register'),
                  child: const Text('Create an account'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _WelcomePanel extends StatelessWidget {
  const _WelcomePanel();

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 570),
      padding: const EdgeInsets.all(40),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF243FAD), Color(0xFF526EF4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Brand(inverse: true),
          Spacer(),
          Icon(
            Icons.menu_book_rounded,
            size: 74,
            color: Colors.white,
          ),
          SizedBox(height: 28),
          Text(
            'Make room for\nyour next big idea.',
            style: TextStyle(
              color: Colors.white,
              fontSize: 34,
              height: 1.15,
              fontWeight: FontWeight.w800,
              letterSpacing: -1,
            ),
          ),
          SizedBox(height: 14),
          Text(
            'A little learning every day can take you a long way. Pick up where you left off.',
            style: TextStyle(color: Color(0xFFE0E7FF), height: 1.6),
          ),
          Spacer(),
          Text(
            'LEARN SOMETHING. BECOME SOMETHING.',
            style: TextStyle(
              color: Color(0xFFC7D2FE),
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand({this.inverse = false});

  final bool inverse;

  @override
  Widget build(BuildContext context) {
    final foreground = inverse ? Colors.white : appInk;
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: inverse ? Colors.white.withValues(alpha: 0.16) : appBlue,
            borderRadius: BorderRadius.circular(13),
          ),
          child: const Icon(Icons.auto_awesome, color: Colors.white, size: 21),
        ),
        const SizedBox(width: 11),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'DevZoft',
              style: TextStyle(
                color: foreground,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              'LEARNING',
              style: TextStyle(
                color: inverse ? const Color(0xFFC7D2FE) : appMuted,
                fontSize: 9,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.7,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
