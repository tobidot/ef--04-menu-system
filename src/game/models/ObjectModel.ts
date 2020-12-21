import { Model } from "@game.object/ts-game-toolbox/dist/src/abstract/mvc/Model";
import { Vector2 } from "../../tools/data/Vector2";
import { InputChain } from "./helpers/input/InputChain";
import { UserInput } from "./helpers/input/ActionTypes";
import { JumpScript } from "./helpers/movement_scripts/JumpScript";
import { PlayerActionScript } from "./helpers/movement_scripts/PlayerActionScript";
import { StepLeftScript } from "./helpers/movement_scripts/StepLeftScript";
import { StepRightScript } from "./helpers/movement_scripts/StepRightScript";
import { ModelCollection } from "./ModelCollection";
import { ActionCombo, ControllableModelAdapter, ControllableModelInterface, PersistantAcceleration } from "./model_adapters/ControllableModelAdapter";
import { PhysicsModelAdapter, PhysicsModelInterface } from "./model_adapters/PhysicsModelAdapter";
import { ModelTable } from "@game.object/ts-game-toolbox/dist/src/abstract/mvc/ModelTable";
import { PlanetModel } from "./PlanetModel";
import { InputDirectionControl } from "./helpers/input/InputDirectionControl";
import { PhysicRelation } from "./GamePhysicsModel";
import { Rect } from "../../tools/data/Rect";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;


export class ObjectModel extends Model<ModelCollection>
    implements
    PhysicsModelInterface,
    ControllableModelInterface {
    // Configuration
    public is_user_controlled: boolean = false;
    public is_active_entity: boolean = false;
    // States
    public position: Vector2 = new Vector2;
    public velocity: Vector2 = new Vector2;
    public rotation: number = 0;
    public is_grounded: boolean = false;

    // game_stats
    public energy: number = 2;
    public collision_box: Rect = new Rect(-5, -5, 10, 10);
    public collision_radius: number = Math.sqrt( 25 + 25);

    // input
    public action_script: PlayerActionScript | null = null;
    public input_chain: InputChain = new InputChain;
    public input_direction_control: InputDirectionControl = new InputDirectionControl;
    public registered_combos: ActionCombo[] = [];

    // physics caching
    public weight: number = 1;
    public caching_physics_relation: WeakMap<ObjectModel, PhysicRelation> = new WeakMap;

    // adapters
    public physics: PhysicsModelAdapter = new PhysicsModelAdapter(this);
    public controllable: ControllableModelAdapter = new ControllableModelAdapter(this);

    constructor(collection: ModelCollection) {
        super(collection);
        const is_grounded = () => this.is_grounded;
        this.controllable.register_combo(
            StepLeftScript,
            is_grounded,
            UserInput.MOVE_LEFT,
            UserInput.STOP_MOVE_LEFT
        );
        this.controllable.register_combo(
            StepRightScript,
            is_grounded,
            UserInput.MOVE_RIGHT,
            UserInput.STOP_MOVE_RIGHT
        );
    }

    public update(delta_seconds: number) {
        if (this.is_active_entity) {
            this.controllable.update(delta_seconds);
        }
        this.energy += delta_seconds;
    }

    public static create_player(table: ModelTable<ModelCollection, ObjectModel>, planet: PlanetModel) {
        const player = table.insert_new();
        player.is_user_controlled = true;
        player.is_active_entity = true;
        player.position = Vector2.from_angle(Math.random() * Math.PI*2, planet.radius + 10);
        return player;
    }

    public static create_enemy(table: ModelTable<ModelCollection, ObjectModel>, planet: PlanetModel) {
        const player = table.insert_new();
        player.is_user_controlled = false;
        player.is_active_entity = true;
        player.position = Vector2.from_angle(Math.random() * Math.PI*2, planet.radius + 10);
        return player;
    }

    public static create_ball(table: ModelTable<ModelCollection, ObjectModel>, planet: PlanetModel) {
        const ball = table.insert_new();
        ball.is_user_controlled = false;
        ball.weight =  0.05;
        ball.collision_box = new Rect(-2,-2,4,4);
        ball.collision_radius = Math.sqrt(4 + 4);
        ball.position = Vector2.from_angle(Math.random() * Math.PI *2, planet.radius + 10 + 200);
        return ball;
    }


}