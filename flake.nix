{
  description = "Client for the Dead by Daylight Tooltips on Twitch";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }:
        let
          corepack = pkgs.stdenv.mkDerivation {
            name = "corepack";
            buildInputs = [ pkgs.nodejs_22 ];
            phases = [ "installPhase" ];
            installPhase = ''
              mkdir -p $out/bin
              corepack enable --install-directory=$out/bin
            '';
          };
        in
        {
          default = pkgs.mkShell {
            packages = [ corepack ];

            nativeBuildInputs = with pkgs; [
              nodejs_22
              git-cliff
              claude-code
            ];
          };
        });
    };
}
