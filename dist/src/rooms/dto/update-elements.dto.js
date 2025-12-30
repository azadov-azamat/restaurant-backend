"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateElementsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
class ElementDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ElementType,
        example: client_1.ElementType.TABLE,
        description: "Type of room element",
    }),
    (0, class_validator_1.IsEnum)(client_1.ElementType),
    __metadata("design:type", String)
], ElementDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5.0,
        description: "X coordinate in meters",
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ElementDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3.0,
        description: "Y coordinate in meters",
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ElementDto.prototype, "y", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1.2,
        description: "Width in meters",
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ElementDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0.8,
        description: "Height in meters",
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ElementDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 0,
        description: "Rotation in degrees (0, 90, 180, 270)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ElementDto.prototype, "rotation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "A1",
        description: "Table code (for TABLE type only)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ElementDto.prototype, "tableCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 4,
        description: "Number of seats (for TABLE type only)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ElementDto.prototype, "seats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: false,
        description: "Is table round (for TABLE type only)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ElementDto.prototype, "isRound", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "left",
        description: "Door swing direction (for DOOR type only)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ElementDto.prototype, "swingDirection", void 0);
class UpdateElementsDto {
}
exports.UpdateElementsDto = UpdateElementsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ElementDto],
        description: "Array of room elements (tables, chairs, doors, etc.)",
        example: [
            {
                type: "TABLE",
                x: 5.0,
                y: 3.0,
                width: 1.2,
                height: 0.8,
                rotation: 0,
                tableCode: "A1",
                seats: 4,
                isRound: false,
            },
            {
                type: "DOOR",
                x: 0.0,
                y: 5.0,
                width: 1.0,
                height: 0.2,
                rotation: 0,
                swingDirection: "left",
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ElementDto),
    __metadata("design:type", Array)
], UpdateElementsDto.prototype, "elements", void 0);
//# sourceMappingURL=update-elements.dto.js.map