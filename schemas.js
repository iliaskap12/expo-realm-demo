import { ObjectId } from 'bson';

const ACCOUNT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive"
}

const USER_TYPE = {
  NORMAL: "normal",
  METROPOLITAN: "metropolitan",
  PRIVILEGED_PRIEST: "privilegedPriest",
  NORMAL_PRIEST: "normalPriest",
  METROPOLITAN_USER_MANAGER: "metropolitanUserManager",
  CHURCH_USER_MANAGER: "churchUserManager"
}

class CustomUser {
  constructor({
    id,
    partition,
    userType,
    accountStatus,
    name,
    contactInfo,
    address,
    donations,
    userSettings,
    canReadPartitions,
    canWritePartitions
  }) {
    this._id = id;
    this._partition = partition;
    this.userType = userType;
    this.accountStatus = accountStatus;
    this.name = name;
    this.contactInfo = contactInfo;
    this.address = address;
    this.donations = donations;
    this.userSettings = userSettings;
    this.canReadPartitions = canReadPartitions;
    this.canWritePartitions = canWritePartitions;
  }

  static schema = {
    name: 'CustomUser',
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      _partition: "string",
      userType: {
        bsonType: 'array',
        items: {
          bsonType: 'string',
          enum: [
            USER_TYPE.NORMAL,
            USER_TYPE.METROPOLITAN,
            USER_TYPE.PRIVILEGED_PRIEST,
            USER_TYPE.NORMAL_PRIEST,
            USER_TYPE.METROPOLITAN_USER_MANAGER,
            USER_TYPE.CHURCH_USER_MANAGER
          ]
        },
        additionalItems: false,
        uniqueItems: true
      },
      accountStatus: {
        bsonType: "string",
        enum: [
          ACCOUNT_STATUS.ACTIVE,
          ACCOUNT_STATUS.INACTIVE
        ]
      },
      name: "string",
      contactInfo: "ContactInfo",
      address: "Address?",
      donations: "Donation?<>",
      fulfilledOffers: "Offer?<>",
      userSettings: "UserSettings",
      canReadPartitions: "string<>",
      canWritePartitions: "string<>"
    }
  }
}

const AddressSchema = {
  name: "Address",
  embedded: true, // default: false
  properties: {
    country: "string",
    city: "string",
    street: "string",
    number: "int",
    zipCode: "int",
    state: "string?"
  },
};

const ContactInfoSchema = {
  name: "ContactInfo",
  embedded: true,
  properties: {
    email: "string",
    phoneCountryCode: "int?",
    phone: "long?"
  }
}

class UserSettings {
  constructor({
    id,
    userId,
    partition,
    shouldPlayRadioOnStartUp,
    shouldPlayRadioOnBackground,
    preferredCurrency,
    preferredTheme,
    preferredLanguage,
    preferredRadioStation,
    autoLightCandleCount,
    names
  }) {
    this._id = id;
    this.userId = userId;
    this._partition = partition;
    this.shouldPlayRadioOnStartUp = shouldPlayRadioOnStartUp;
    this.shouldPlayRadioOnBackground = shouldPlayRadioOnBackground;
    this.preferredCurrency = preferredCurrency;
    this.preferredTheme = preferredTheme;
    this.preferredLanguage = preferredLanguage;
    this.preferredRadioStation = preferredRadioStation;
    this.autoLightCandleCount = autoLightCandleCount;
    this.names = names;
  }

  static schema = {
    name: "UserSettings",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      _partition: "string",
      userId: {
        type: "linkingObjects",
        objectType: "CustomUser",
        property: "userSettings"
      },
      shouldPlayRadioOnBackground: {
        bsonType: "bool",
        default: true
      },
      shouldPlayRadioOnStartUp: {
        bsonType: "bool",
        default: false
      },
      preferredCurrency: {
        bsonType: "string",
        enum: ["USD", "EUR", "GBP", "CAD", "AUD"],
        default: "EUR"
      },
      preferredTheme: {
        bsonType: "string",
        enum: ["LIGHT", "DARK"],
        default: "LIGHT"
      },
      preferredLanguage: {
        bsonType: "string",
        enum: ["ENG", "ΕΛ"],
        default: "ΕΛ"
      },
      preferredRadioStation: "Church?",
      autoLightCandleCount: {
        bsonType: "int",
        default: 3,
        minimum: 1
      },
      names: {
        bsonType: "object?",
        properties: {
          forHealth: "string?[]",
          forTheDeparted: "string?[]"
        }
      }
    }
  }
}

// Church, Metropolis, Event, Receipt, UserRequest

class Donation {
  constructor({
    id,
    partition,
    date,
    sum,
    offers,
    church,
    userId,
    provider,
    receipt
  }) {
    this._id = id;
    this._partition = partition;
    this.date = date;
    this.sum = sum;
    this.offers = offers;
    this.church = church;
    this.userId = userId;
    this.provider = provider;
    this.receipt = receipt;
  }

  static schema = {
    name: "Donation",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      _partition: "string",
      date: "date",
      sum: "double",
      offers: "Offer[]",
      church: "Church",
      userId: {
        type: "linkingObjects",
        objectType: "CustomUser",
        property: "Donations"
      },
      provider: "string?",
      receipt: "Receipt"
    }
  }
}

class Offer {
  constructor({
    id,
    partition,
    donationId,
    type,
    price,
    fulfilled,
    fulfilledBy,
    fulfillmentDate,
    acknowledgementDate
  }) {
    this._id = id;
    this._partition = partition;
    this.donationId = donationId;
    this.type = type;
    this.price = price;
    this.fulfilled = fulfilled;
    this.fulfilledBy = fulfilledBy;
    this.fulfillmentDate = fulfillmentDate;
    this.acknowledgementDate = acknowledgementDate;
  }

  static schema = {
    name: "Offer",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      _partition: "string",
      donationId: {
        type: "linkingObjects",
        objectType: "Donation",
        property: "offers"
      },
      type: {
        bsonType: "string",
        enum: [
          OFFERS.CANDLE,
          OFFERS.BIG_CANDLE,
          OFFERS.LAMP,
          OFFERS.HOLY_BREAD,
          OFFERS.FANOUROPITA,
          OFFERS.ARTOKLASIA,
          OFFERS.WINE,
          OFFERS.OLIVE_OIL,
          OFFERS.FOR_THE_POOR,
          OFFERS.COMMON_MEAL,
          OFFERS.OTHER
        ]
      },
      price: "double",
      fulfillment: {
        bsonType: "object?",
        properties: {
          fulfilled: {
            bsonType: "bool",
            default: false
          },
          fulfilledBy: {
            type: "linkingObjects",
            objectType: "CustomUser",
            property: "fulfilledOffers"
          },
          fulfillmentDate: "date",
          acknowledgementDate: "date"
        }
      }
    }
  }
}

const OFFERS = {
  CANDLE: "CANDLE",
  BIG_CANDLE: "BIG CANDLE",
  LAMP: "LAMP",
  HOLY_BREAD: "HOLY BREAD",
  FANOUROPITA: "FANOUROPITA",
  ARTOKLASIA: "ARTOKLASIA",
  WINE: "WINE",
  OLIVE_OIL: "OLIVE OIL",
  FOR_THE_POOR: "FOR THE POOR",
  COMMON_MEAL: "COMMON MEAL",
  OTHER: "OTHER"
}