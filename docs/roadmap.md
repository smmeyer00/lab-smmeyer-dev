# Lab roadmap

Working notes for ideas that may become lab projects or additions to existing ones.

## Desk

### Collision-enabled walkthrough

Add Minecraft-style collision and grounded movement to `/desk`.

- Use `@react-three/rapier` for browser physics.
- Drive a player capsule or kinematic character controller instead of moving the camera directly.
- Keep jump grounding, running, step climbing, slope limits, and ground snapping in the character controller.
- Build a lightweight collision collection in Blender for the floor, walls, desk, drawers, chair, PC, and other large objects. Avoid using the detailed render mesh as collision geometry.
- Export the collision collection separately or with predictable `collision_*` names so the viewer can hide those meshes and create colliders from them.
- Test that the player stops at walls and furniture, can land on supported surfaces, and cannot jump repeatedly in midair.
- Check desktop performance after adding physics; keep the touch experience in inspection mode.
