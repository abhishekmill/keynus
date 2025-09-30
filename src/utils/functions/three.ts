import { Object3D, Object3DEventMap } from "three";

export function extractParent(obj: Object3D<Object3DEventMap>, destination: "Locker" | "Door" | "Cabinet") {
  if (obj.parent == null) return null;

  if (obj.parent?.name?.includes(destination)) {
    return obj.parent;
  }

  return extractParent(obj.parent, destination);
}
