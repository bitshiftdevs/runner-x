# 📖 Runner_X Engineering Principles & Repository Rules

These are non-negotiable rules for every contributor and AI agent. They combine the strict visual aesthetics of Runner_X with enterprise-grade Clean Architecture principles.

---

## 1. Theme — Never Branch on Brightness
**Rule:** Widgets must never check `Theme.of(context).brightness` to pick colours. All colour decisions live in the core theme and flow through `Theme.of(context).colorScheme` or `TextTheme`.
```dart
// ❌ Never do this
color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
// ✅ Do this
color: Theme.of(context).colorScheme.surface,
```

## 2. Colours — `AppColors` Is a Palette, Not a Dependency
**Rule:** Widgets must not import `AppColors` to resolve light/dark pairs. `AppColors` is only for theme generation and mode-independent colours (like `AppColors.primary`, `AppColors.error`).

## 3. Design & Visual Excellence (The "Wow" Factor)
**Rule:** We build premium interfaces. Use the customized Material 3 widgets (flat elevations, large border radii `AppDimensions.radiusLg`). Provide micro-animations for interactions. Never use plain red/blue/green—use the exact tokens in `AppTheme`.

## 4. Navigation — Use GoRouter Only
**Rule:** All navigation must go through GoRouter via `context.go()`, `context.push()`, or `context.pop()`. Direct `Navigator.of(context).push()` calls are banned except inside `RunnerAppBar`.

## 5. Route Paths — Always Use `AppStrings` Constants
**Rule:** Route paths are defined once in `AppStrings` (`lib/core/constants/app_strings.dart`) and registered in `AppRouter`. Never hardcode a path string at a call site.
```dart
// ❌ Never do this
context.go('/post-job');
// ✅ Do this
context.go(AppStrings.routePostJob);
```

## 6. State Management — Riverpod Notifiers Only
**Rule:** Async operations or non-trivial UI state must use Riverpod `@riverpod` Notifiers (`Notifier` or `AsyncNotifier`). State must be immutable. Business logic lives in the Notifier, never in the Widget.

## 7. Architecture — Clean Layers, No Skipping
**Rule:** Every feature follows `data → domain → presentation`. 
- **Presentation** depends on **Domain**.
- **Data** depends on **Domain**. 
- **Domain** depends on nothing (pure Dart).

## 8. Dependency Injection — Riverpod Providers
**Rule:** We use Riverpod for all DI. Repositories and Data Sources must be exposed via `@riverpod` providers. No `GetIt` or global singletons.

## 9. Error Handling — Exceptions in Data, Caught in Presentation
**Rule:** Data layer throws custom exceptions. The presentation layer (Notifier) catches them and maps them to human-readable states. Use `error_handler.dart` for uniform error parsing.

## 10. Shared Widgets — Core Library First
**Rule:** Before writing a new widget, check `lib/shared/widgets/`. Use `RunnerButton`, `RunnerTextField`, and `RunnerAppBar`.

## 11. Snackbars — Always Use `AppSnackbar`
**Rule:** Never construct a raw `SnackBar`. Use `AppSnackbar.showSuccess()`, `AppSnackbar.showError()`, etc.

## 12. Barrel Files — One Per Layer
**Rule:** Each feature layer exposes a barrel file for its public API. Do not cross-import deep internal files from other features.

## 13. Formatting and Analysis — Zero Tolerance
**Rule:** Every change must pass `flutter analyze` with **no issues**. Run `flutter format .` before committing.

## 14. Constants — No Magic Values
**Rule:** No hardcoded numbers or strings in widgets.
- Spacing/Radius: `AppDimensions`
- Icons: `AppIcons`
- Routes: `AppStrings`

## 15. Listeners — Separate from Build Logic
**Rule:** Side-effects (snackbars, routing) must be handled inside `ref.listen()`, NOT inside the `build` layout tree directly.

## 16. State Classes — Freezed Immutable Models
**Rule:** All models and complex states must be built with `Freezed` (`@freezed`). They must be `@immutable`, have `copyWith`, and handle JSON serialization gracefully.

## 17. Async Safety — Check `context.mounted`
**Rule:** Any `async` method in a widget must guard `BuildContext` usage with `if (!context.mounted) return;` after an `await`.

## 18. Database & Infrastructure — Supabase
**Rule:** All schema changes are handled via Supabase SQL scripts. Local data caching uses `Isar`. Realtime subscriptions must be managed cleanly via StreamProviders.

## 19. Code Size — Strict < 150 Lines Limit
**Rule:** No single Dart file may exceed 150 lines of code. If a file grows, extract visual segments into local `widgets/` directories.

## 20. Naming Conventions
**Rule:**
- Files: `snake_case`
- Classes: `PascalCase`
- Variables/Methods: `camelCase`
- Private members: `_camelCase`
- Providers: `featureNameProvider`

## 21. Logging — Use `AppLogger`
**Rule:** Never use `print()`. All logging goes through `AppLogger.log()` or `AppLogger.error()` in `core/utils/app_logger.dart`.
