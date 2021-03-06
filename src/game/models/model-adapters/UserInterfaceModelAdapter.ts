import { Rect } from "@game.object/ts-game-toolbox/src/geometries/Rect";
import { Vector2, Vector2I } from "@game.object/ts-game-toolbox/src/geometries/Vector2";
import { Game } from "../../base/Game";
import { UserInterfaceEvent } from "../../events/UserInterfaceEvent";

export interface UserInterfaceAdaptable {
    collider: Rect;
    is_clickable: boolean;
    // click(in_game_position: Vector2I): UserInterfaceEvent;
}

export class UserInterfaceModelAdapter {
    protected constructor(public target: UserInterfaceAdaptable) { }

    public is_clicked(in_game_mouse_position: Vector2I): boolean {
        return (this.target.collider.contains(in_game_mouse_position))
            && this.target.is_clickable;
    }

    /**
     * Static Functions
     */
    private static instance?: UserInterfaceModelAdapter;

    public static for(target: UserInterfaceAdaptable): UserInterfaceModelAdapter {
        if (!UserInterfaceModelAdapter.instance) {
            UserInterfaceModelAdapter.instance = new UserInterfaceModelAdapter(target);
        }
        UserInterfaceModelAdapter.instance.target = target;
        return UserInterfaceModelAdapter.instance;
    }
}