using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace recipes_app.Migrations
{
    /// <inheritdoc />
    public partial class UsersRecipesPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Users",
                newName: "Introduction");

            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Recipes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_AppUserId",
                table: "Recipes",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_Users_AppUserId",
                table: "Recipes",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_Users_AppUserId",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_AppUserId",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Recipes");

            migrationBuilder.RenameColumn(
                name: "Introduction",
                table: "Users",
                newName: "Description");
        }
    }
}
