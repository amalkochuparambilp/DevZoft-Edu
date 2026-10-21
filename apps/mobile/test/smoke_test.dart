import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('smoke', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Scaffold(body: Text('DevZoft Learning'))));
    expect(find.text('DevZoft Learning'), findsOneWidget);
  });
}
