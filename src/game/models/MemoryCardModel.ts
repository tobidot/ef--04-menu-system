import { tools } from "@game.object/ts-game-toolbox";
import { Vector2 } from "@game.object/ts-game-toolbox/dist/src/geometries/Vector2";
import { Model } from "@game.object/ts-game-toolbox/src/abstract/mvc/Model";
import { RgbColor } from "@game.object/ts-game-toolbox/src/data/RgbColor";
import { ModelCollection } from "./ModelCollection";

export class MemoryCardModel extends Model<ModelCollection> {
    public color: RgbColor = tools.commons.Colors.WHITE;
    public is_revealed: boolean = false;
    public position: Vector2 = new Vector2();
}