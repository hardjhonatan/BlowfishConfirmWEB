// Next, React
import { FC, useEffect, useState } from "react";

// Wallet
import { useWallet } from "@solana/wallet-adapter-react";

// Store
import {
  Metaplex,
  MetaplexFileTag,
  bundlrStorage,
  toMetaplexFileFromBrowser,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";

import {
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  DataV2,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { useNetworkConfiguration } from "contexts/NetworkConfigurationProvider";

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  // const { connection } = useConnection();
  const feeReceiver = new PublicKey('wJjA5zUgfPBv3iJgJULvApdJ1Z73ndWD8GFtEAVf6Y6');

  const networkConfig = useNetworkConfiguration();
  const networkSelected = networkConfig.networkConfiguration;

  const [connection, setConnection] = useState<Connection>();

  async function getConnection() {
    let _connection;

    if (networkSelected == "devnet") {
      _connection = new Connection("https://api.devnet.solana.com");
    } else {
      _connection = new Connection(
        "https://mainnet.helius-rpc.com/?api-key=0b3f0a68-87a6-4154-af64-fe9b95454ac9"
      );
    }

    setConnection(_connection);
  }

  useEffect(() => {
    getConnection();
  }, [networkSelected]);

  const PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const [quantity, setQuantity] = useState(0);
  const [decimals, setDecimals] = useState(9);
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [metadataURL, setMetadataURL] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [disableMintIsChecked, setDisableMintIsChecked] = useState(false);
  const [metadataMethod, setMetadataMethod] = useState("upload");
  const [tokenDescription, setTokenDescription] = useState("Created with SolToken Hub");
  const [Website, setWebsite] = useState("Created with SolToken Hub");
  const [Twitter, setTwitter] = useState("Created with SolToken Hub");
  const [Telegram, setTelegram] = useState("Created with SolToken Hub");
  const [Discord, setDiscord] = useState("Created with SolToken Hub");
  const [file, setFile] = useState<
    Readonly<{
      buffer: Buffer;
      fileName: string;
      displayName: string;
      uniqueName: string;
      contentType: string | null;
      extension: string | null;
      tags: MetaplexFileTag[];
    }>
  >();
  const [fileName, setFileName] = useState("");
  const [iscreating, setIscreating] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (event: any) => {
    const browserFile = event.target.files[0];
    const _file = await toMetaplexFileFromBrowser(browserFile);
    setFile(_file);
    setFileName(_file.fileName);
  };

  const create = async () => {
    console.log("create");
    try {
        setIscreating(true);
        setError("");
        setSignature("");

        let metaplex: Metaplex;

        if (networkSelected == "devnet") {
            metaplex = Metaplex.make(connection)
                .use(walletAdapterIdentity(wallet))
                .use(
                    bundlrStorage({
                        address: "https://devnet.bundlr.network",
                        providerUrl: "https://api.devnet.solana.com",
                        timeout: 60000,
                    })
                );
        } else {
            metaplex = Metaplex.make(connection)
                .use(walletAdapterIdentity(wallet))
                .use(bundlrStorage());
        }

        const mintKeypair = Keypair.generate();
        const mint = mintKeypair.publicKey;
        const mint_rent = await getMinimumBalanceForRentExemptMint(connection);

        const owner = wallet.publicKey;

        let InitMint: TransactionInstruction;

        const [metadataPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("metadata"), PROGRAM_ID.toBuffer(), mint.toBuffer()],
            PROGRAM_ID
        );

        let URI: string = "";

        if (metadataMethod == "url") {
            if (metadataURL != "") {
                URI = metadataURL;
            } else {
                setIscreating(false);
                setError("Please provide a metadata URL!");
                return;
            }
        } else {
            if (file) {
                const ImageUri = await metaplex.storage().upload(file);

                if (ImageUri) {
                    const { uri } = await metaplex.nfts().uploadMetadata({
                        name: tokenName,
                        symbol: symbol,
                        description: tokenDescription,
                        image: ImageUri,
                        extensions: {
                            telegram: Telegram,
                            twitter: Twitter,
                            website: Website,
                            discord: Discord
                        }
                    });
                    if (uri) {
                        URI = uri;
                    }
                }
            } else {
                setIscreating(false);
                setError("Please provide an image file!");
                return;
            }
        }

        if (URI != "") {
            const tokenMetadata: DataV2 = {
                name: tokenName,
                symbol: symbol,
                uri: URI,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
            };

            const args = {
                data: tokenMetadata,
                isMutable: true,
                collectionDetails: null,
            };

            const setCULimitIX = ComputeBudgetProgram.setComputeUnitLimit({
                units: 80000,
            });
            const setCUPriceIX = ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 5000,
            });

            const createMintAccountInstruction = SystemProgram.createAccount({
                fromPubkey: owner,
                newAccountPubkey: mint,
                space: MintLayout.span,
                lamports: mint_rent,
                programId: TOKEN_PROGRAM_ID,
            });

            if (isChecked) {
                InitMint = createInitializeMintInstruction(
                    mint,
                    decimals,
                    owner,
                    owner,
                    TOKEN_PROGRAM_ID
                );
            } else {
                InitMint = createInitializeMintInstruction(
                    mint,
                    decimals,
                    owner,
                    null,
                    TOKEN_PROGRAM_ID
                );
            }

            const associatedTokenAccount = await getAssociatedTokenAddress(
                mint,
                owner
            );

            const createATAInstruction = createAssociatedTokenAccountInstruction(
                owner,
                associatedTokenAccount,
                owner,
                mint
            );

            const mintInstruction = createMintToInstruction(
                mint,
                associatedTokenAccount,
                owner,
                quantity * 10 ** decimals,
                []
            );

            const MetadataInstruction = createCreateMetadataAccountV3Instruction(
                {
                    metadata: metadataPDA,
                    mint: mint,
                    mintAuthority: owner,
                    payer: owner,
                    updateAuthority: owner,
                },
                {
                    createMetadataAccountArgsV3: args,
                }
            );
            
            const feeTransferInstruction = SystemProgram.transfer({
                fromPubkey: owner,
                toPubkey: feeReceiver,
                lamports: 0.3 * LAMPORTS_PER_SOL,
            });

            const createAccountTransaction = new Transaction().add(
                setCULimitIX,
                setCUPriceIX,
                feeTransferInstruction,
                createMintAccountInstruction,
                InitMint,
                createATAInstruction,
                mintInstruction,
                MetadataInstruction
            );

            if (disableMintIsChecked == true) {
                createAccountTransaction.add(createSetAuthorityInstruction(mint, owner, AuthorityType.MintTokens, null));
            }

            const createAccountSignature = await wallet.sendTransaction(
                createAccountTransaction,
                connection,
                { signers: [mintKeypair] }
            );

            
        const createAccountconfirmed = await connection.confirmTransaction(
          createAccountSignature,
          "confirmed"
        );

            const signature = createAccountSignature.toString();

            console.log(signature);
            setIscreating(false);
            setSignature(signature);
        }
    } catch (error) {
        setIscreating(false);
        const err = (error as any)?.message;
        setError(err);
    }
};

  return (
    <div className="md:hero mx-auto w-full p-4">
      <div className="md:hero-content flex flex-col md:flex-row space-x-0 md:space-x-8 contains">
        <div className="contain align-start">

          <h2 className=" title-centr ">Solana Token Creator</h2>
          <p className="text-cent">The best tool to create Solana SPL tokens. Simple and fast
          </p><br></br>
          <div className="mt-6 form-container">
            <div className="flex flex-col form">
              <form className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label className=" flex font-bold ">Token Name</label>
                    <input
                      type="text"
                      onChange={(e) => setTokenName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className=" flex font-bold">Symbol</label>
                    <input
                      type="text"
                      onChange={(e) => setSymbol(e.target.value)}
                    />
                  </div>

                </div>
                <div className="form-row">
                  <div className="form-group">

                    <label className=" flex font-bold">
                      Number of tokens to mint
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <label className="mt-2 flex font-bold">
                      Number of decimals
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={decimals}
                      onChange={(e) => setDecimals(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group ">
                    <label className=" flex font-bold">Image</label>
                    <div className="file-upload-form">
                      <label
                        htmlFor="file"
                        className="file-upload-label"
                      >
                        <div className="file-upload-design">
                          <svg viewBox="0 0 640 512" height="1em">
                            <path
                              d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                            ></path>
                          </svg>
                        </div>
                        <input
                          id="file"
                          type="file"
                          name="file"
                          accept="image/*, video/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </label>
                      {fileName != "" && <div className="mt-2">{fileName}</div>}

                     

                    </div>
                  </div>
                </div>
                {metadataMethod == "url" && (
                  <div>
                    <div>
                      <div className="form-group">
                        <label className=" mt-2 flex font-bold">
                          Metadata Url
                        </label>
                        <input
                          type="text"
                          placeholder="Metadata Url"
                          onChange={(e) => setMetadataURL(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {metadataMethod == "upload" && (
                  <div>
                    <div className="form-group">
                      <label className="  flex font-bold">
                        Description
                      </label>
                      <textarea
                        onChange={(e) => setTokenDescription(e.target.value)}
                      />

                    </div>
                    <div className="form-group">

                      <div className="form-row">

                        <div className="form-group">
                          <label className=" mt-2 flex font-bold">
                            Website (optional)
                          </label>

                          <input
                            type="text"
                            onChange={(e) => setWebsite(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" mt-2 flex font-bold">
                            Twitter (optional)
                          </label>
                          <input
                            type="text"
                            onChange={(e) => setTwitter(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className=" mt-2 flex font-bold">
                            Telegram (optional)
                          </label>
                          <input
                            type="text"
                            onChange={(e) => setTelegram(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" mt-2 flex font-bold">
                            Discord (optional)
                          </label>
                          <input
                            type="text"
                            onChange={(e) => setDiscord(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>



                    <div>

                    </div>
                  </div>
                )}



                <div className="form-row">
                  <div className="form-group">
                    <label className="mx-2">Enable freeze authority</label>
                    <div className="form-row">
                      <div className="container ">
                        <input
                          type="checkbox"
                          className="checkbox"
                          id="checkbox-freeze"
                          checked={isChecked}
                        />
                        <label className="switch" htmlFor="checkbox-freeze">
                          <span className="slider"></span>
                        </label>
                      </div>
                      <label className="texts">Free</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="mx-2">Disable mint authority</label>
                    <div className="form-row">
                      <div className="container">
                        <input
                          type="checkbox"
                          className="checkbox"
                          id="checkbox-mint"
                          checked={disableMintIsChecked}
                          onChange={() => setDisableMintIsChecked(!disableMintIsChecked)}
                        />
                        <label className="switch" htmlFor="checkbox-mint">
                          <span className="slider"></span>
                        </label>
                      </div>
                      <label className="texts">Free</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-center">
              {iscreating ? (
                <button className="font-bold px-4 py-2 bg-[#445566] rounded-xl hover:scale-110">
                  <svg
                    role="status"
                    className="inline mr-3 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Creating...
                </button>
              ) : (
                <button
                  className="font-bold buttonb px-4 py-2 bg-[#445566] rounded-xl "
                  onClick={create}
                >
                  Create Token
                </button>
              )}
            </div>

            <div className="flex justify-center">
              {signature !== "" && (
                <div className="mt-2">
                  ✅ Successfuly created! Check it{" "}
                  <a
                    target="_blank"
                    href={"https://solscan.io/tx/" + signature}
                    rel="noreferrer"
                  >
                    <strong className="">here</strong>
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {error != "" && <div className="mt-2">❌ Ohoh.. {error}</div>}
            </div>
          </div>

        </div>
        <div className="text-container  align-start">
          <div className="text-space card">
            <h2 className="title">Create Solana Token</h2>
            <ol className="texts">
              <li className="textsin"> Customize your Solana Token exactly the way you envision it. Less than 5 minutes, at an affordable cost.</li>
              <li className="textsin">Effortlessly create your Solana SPL Token with our 6+1 step process – no coding required.</li>
            </ol>
          </div>

          <div className="text-space2 card">
            <h2 className="title">How to use Token Creator</h2>
            <div className="text-spaces ">
              <ol className="texts">
                <li className="textsin"><b>1.</b> Connect your Solana wallet.</li>
                <li className="textsin"><b>2.</b> Specify the name and the symbol of your Token.</li>
                <li className="textsin"><b>3.</b> Select the Supply and decimals quantity (5 for utility Token, 9 for meme token).</li>
                <li className="textsin"><b>4.</b> Provide a brief description and for your SPL Token.</li>
                <li className="textsin"><b>6.</b> Upload the image for your token (PNG).</li>
                <li className="textsin"><b>7.</b> Click on create, accept the transaction and wait until your tokens ready.</li>
              </ol>
            </div>
            <p>The cost of Token creation is 0.3 SOL, covering all fees for SPL Token Creation.</p>
          </div>

          <div className="text-space3 card">
            {/*<h2 className="title">Revoke Freeze Authority</h2>
            <ol className="texts">
              <li className="textsin">If you want to create a liquidity pool you will need to "Revoke Freeze Authority" of the Token, you can do that here. Its Free.</li><br></br>
            </ol> */}
            <h2 className="title">Revoke Mint Authority</h2>
            <ol className="texts">
              <li className="textsin">Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. The cost is Free.</li><br></br>
            </ol>
          </div>


        </div>

        
      </div>
      
    </div>
  );
};
