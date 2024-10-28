"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesServerResponse = exports.TypesClientRequest = void 0;
var TypesClientRequest;
(function (TypesClientRequest) {
  TypesClientRequest["reg"] = "reg";
  TypesClientRequest["create_room"] = "create_room";
  TypesClientRequest["add_user_to_room"] = "add_user_to_room";
  TypesClientRequest["add_ships"] = "add_ships";
  TypesClientRequest["attack"] = "attack";
  TypesClientRequest["randomAttack"] = "randomAttack";
  TypesClientRequest["single_play"] = "single_play";
})(
  TypesClientRequest || (exports.TypesClientRequest = TypesClientRequest = {}),
);
var TypesServerResponse;
(function (TypesServerResponse) {
  TypesServerResponse["reg"] = "reg";
  TypesServerResponse["update_winners"] = "update_winners";
  TypesServerResponse["create_game"] = "create_game";
  TypesServerResponse["update_room"] = "update_room";
  TypesServerResponse["start_game"] = "start_game";
  TypesServerResponse["attack"] = "attack";
  TypesServerResponse["turn"] = "turn";
  TypesServerResponse["finish"] = "finish";
})(
  TypesServerResponse ||
    (exports.TypesServerResponse = TypesServerResponse = {}),
);
//# sourceMappingURL=typesOfRequestResponse.js.map
