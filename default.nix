{ lib
, rustPlatform
}:
rustPlatform.buildRustPackage rec {
  pname = "maisie";
  version = "0.1.0";
  cargoLock.lockFile = ./Cargo.lock;
  cargoLock.outputHashes = {
    "sap-0.1.0-alpha.1" = "sha256-r+1NTVRxD3VFB4GKojfe+ZLZicTwXBfhreWV6UDwNAE=";
  };
  src = lib.cleanSource ./.;
}
