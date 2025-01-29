/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/symphonyledger.json`.
 */
export type Symphonyledger = {
  "address": "Feq9pcxUbG3Yc8hTMN6hhDihrhN4XNXiK3hxkHQRB1qN",
  "metadata": {
    "name": "symphonyledger",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "addRecording",
      "discriminator": [
        38,
        203,
        37,
        197,
        188,
        39,
        4,
        225
      ],
      "accounts": [
        {
          "name": "recordingAccount",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "feeCollector",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "length",
          "type": "u32"
        },
        {
          "name": "releaseYear",
          "type": "u32"
        },
        {
          "name": "artistName",
          "type": "string"
        },
        {
          "name": "artistShare",
          "type": "u8"
        },
        {
          "name": "composerName",
          "type": "string"
        },
        {
          "name": "composerPubkey",
          "type": "pubkey"
        },
        {
          "name": "composerShare",
          "type": "u8"
        },
        {
          "name": "producerName",
          "type": "string"
        },
        {
          "name": "producerPubkey",
          "type": "pubkey"
        },
        {
          "name": "producerShare",
          "type": "u8"
        },
        {
          "name": "labelName",
          "type": "string"
        },
        {
          "name": "labelPubkey",
          "type": "pubkey"
        },
        {
          "name": "labelShare",
          "type": "u8"
        },
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "album",
          "type": "string"
        }
      ]
    },
    {
      "name": "transferRights",
      "discriminator": [
        66,
        110,
        168,
        232,
        189,
        84,
        250,
        173
      ],
      "accounts": [
        {
          "name": "recordingAccount",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newLabelName",
          "type": "string"
        },
        {
          "name": "newLabelPubkey",
          "type": "pubkey"
        },
        {
          "name": "newLabelShare",
          "type": "u8"
        }
      ]
    },
    {
      "name": "distributeRoyalties",
      "discriminator": [
        231,
        198,
        160,
        162,
        181,
        219,
        140,
        100
      ],
      "accounts": [
        {
          "name": "recordingAccount",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "artistAccount",
          "writable": true
        },
        {
          "name": "composerAccount",
          "writable": true
        },
        {
          "name": "producerAccount",
          "writable": true
        },
        {
          "name": "labelAccount",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTicketSale",
      "discriminator": [
        172,
        239,
        108,
        166,
        128,
        229,
        254,
        72
      ],
      "accounts": [
        {
          "name": "ticketSaleAccount",
          "writable": true
        },
        {
          "name": "recordingAccount"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "recordingId",
          "type": "string"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "totalTickets",
          "type": "u32"
        },
        {
          "name": "eventDate",
          "type": "i64"
        },
        {
          "name": "venue",
          "type": "string"
        }
      ]
    },
    {
      "name": "purchaseTicket",
      "discriminator": [
        90,
        91,
        173,
        20,
        72,
        109,
        15,
        146
      ],
      "accounts": [
        {
          "name": "ticketSaleAccount",
          "writable": true
        },
        {
          "name": "ticketPurchaseAccount",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "quantity",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "recording",
      "discriminator": [
        127,
        40,
        57,
        149,
        55,
        75,
        215,
        111
      ]
    },
    {
      "name": "ticketSale",
      "discriminator": [
        9,
        138,
        226,
        102,
        204,
        241,
        250,
        148
      ]
    },
    {
      "name": "ticketPurchase",
      "discriminator": [
        222,
        22,
        3,
        148,
        12,
        69,
        58,
        40
      ]
    }
  ],
  "events": [
    {
      "name": "ticketSaleCreated",
      "discriminator": [
        241,
        208,
        247,
        161,
        14,
        123,
        171,
        138
      ]
    },
    {
      "name": "ticketPurchased",
      "discriminator": [
        108,
        59,
        246,
        95,
        84,
        145,
        13,
        71
      ]
    },
    {
      "name": "labelChanged",
      "discriminator": [
        11,
        193,
        36,
        173,
        133,
        250,
        172,
        1
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "The signer is not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "invalidShares",
      "msg": "The sum of all shares must equal 100%."
    },
    {
      "code": 6002,
      "name": "insufficientTickets",
      "msg": "Not enough tickets remaining for purchase."
    },
    {
      "code": 6003,
      "name": "eventExpired",
      "msg": "The event has already passed."
    },
    {
      "code": 6004,
      "name": "calculationError",
      "msg": "Calculation error occurred."
    }
  ],
  "types": [
    {
      "name": "detailAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "pubkey",
            "type": "pubkey"
          },
          {
            "name": "share",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "recording",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "length",
            "type": "u32"
          },
          {
            "name": "releaseYear",
            "type": "u32"
          },
          {
            "name": "lastUpdated",
            "type": "u128"
          },
          {
            "name": "artist",
            "type": {
              "defined": {
                "name": "detailAccount"
              }
            }
          },
          {
            "name": "composer",
            "type": {
              "defined": {
                "name": "detailAccount"
              }
            }
          },
          {
            "name": "producer",
            "type": {
              "defined": {
                "name": "detailAccount"
              }
            }
          },
          {
            "name": "label",
            "type": {
              "defined": {
                "name": "detailAccount"
              }
            }
          },
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "album",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "ticketSale",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recordingId",
            "type": "string"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "totalTickets",
            "type": "u32"
          },
          {
            "name": "remainingTickets",
            "type": "u32"
          },
          {
            "name": "eventDate",
            "type": "i64"
          },
          {
            "name": "venue",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "proceeds",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ticketPurchase",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "ticketSale",
            "type": "pubkey"
          },
          {
            "name": "quantity",
            "type": "u32"
          },
          {
            "name": "purchaseDate",
            "type": "i64"
          },
          {
            "name": "totalPaid",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ticketSaleCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recordingId",
            "type": "string"
          },
          {
            "name": "totalTickets",
            "type": "u32"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "eventDate",
            "type": "i64"
          },
          {
            "name": "venue",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "ticketPurchased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "recordingId",
            "type": "string"
          },
          {
            "name": "quantity",
            "type": "u32"
          },
          {
            "name": "totalPaid",
            "type": "u64"
          },
          {
            "name": "purchaseDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "labelChanged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recordingId",
            "type": "string"
          },
          {
            "name": "oldLabel",
            "type": {
              "defined": {
                "name": "detailAccount"
              }
            }
          },
          {
            "name": "newLabel",
            "type": {
              "defined": {
                "name": "detailAccount"
              }
            }
          },
          {
            "name": "updatedAt",
            "type": "u128"
          }
        ]
      }
    }
  ]
};

