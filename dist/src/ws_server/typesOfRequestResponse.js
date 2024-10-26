"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesClientAction = exports.TypesServerAction = void 0;
var TypesServerAction;
(function (TypesServerAction) {
  TypesServerAction[(TypesServerAction["reg"] = 0)] = "reg";
  TypesServerAction[(TypesServerAction["create_room"] = 1)] = "create_room";
  TypesServerAction[(TypesServerAction["add_user_to_room"] = 2)] =
    "add_user_to_room";
  TypesServerAction[(TypesServerAction["add_ships"] = 3)] = "add_ships";
  TypesServerAction[(TypesServerAction["attack"] = 4)] = "attack";
  TypesServerAction[(TypesServerAction["randomAttack"] = 5)] = "randomAttack";
})(TypesServerAction || (exports.TypesServerAction = TypesServerAction = {}));
var TypesClientAction;
(function (TypesClientAction) {
  TypesClientAction[(TypesClientAction["reg"] = 0)] = "reg";
  TypesClientAction[(TypesClientAction["update_winners"] = 1)] =
    "update_winners";
  TypesClientAction[(TypesClientAction["create_game"] = 2)] = "create_game";
  TypesClientAction[(TypesClientAction["update_room"] = 3)] = "update_room";
  TypesClientAction[(TypesClientAction["start_game"] = 4)] = "start_game";
  TypesClientAction[(TypesClientAction["attack"] = 5)] = "attack";
  TypesClientAction[(TypesClientAction["turn"] = 6)] = "turn";
  TypesClientAction[(TypesClientAction["finish"] = 7)] = "finish";
})(TypesClientAction || (exports.TypesClientAction = TypesClientAction = {}));
//# sourceMappingURL=typesOfRequestResponse.js.map
