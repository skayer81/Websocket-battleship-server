"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesServerAction = exports.TypesServerResponseError = void 0;
var TypesServerResponseError;
(function (TypesServerResponseError) {
  TypesServerResponseError["wrong_password"] = "wrong_password";
  TypesServerResponseError["user_is_onlain"] = "user_is_onlain";
})(
  TypesServerResponseError ||
    (exports.TypesServerResponseError = TypesServerResponseError = {}),
);
var TypesServerAction;
(function (TypesServerAction) {
  TypesServerAction["user_in_base"] = "user_in_base";
  TypesServerAction["add_user"] = "add_user";
  TypesServerAction["is_user_in_room"] = "is_user_in_room";
  TypesServerAction["create_room"] = "create_room";
  TypesServerAction["add_user_in_room"] = "add_user_in_room";
  TypesServerAction["del_room"] = "del_room";
  TypesServerAction["not_current_player"] = "not_current_player";
  TypesServerAction["reshot"] = "reshot";
  TypesServerAction["random_attack"] = "random_attack";
  TypesServerAction["killed"] = "killed";
  TypesServerAction["new_connection"] = "new_connection";
  TypesServerAction["user_disconnect"] = "user_disconnect";
})(TypesServerAction || (exports.TypesServerAction = TypesServerAction = {}));
//# sourceMappingURL=logHandlerTypes.js.map
