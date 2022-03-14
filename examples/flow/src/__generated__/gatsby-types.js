/* eslint-disable */

// @flow

/** All built-in and custom scalars, mapped to their actual values */
declare type Scalars = {|
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  ID: string,
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string,
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean,
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number,
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number,
  /** A date string, such as 2007-12-03, compliant with the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: string,
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
|};










declare type GatsbyTypes$AVIFOptions = {|
  lossless?: ?$ElementType<Scalars, 'Boolean'>,
  quality?: ?$ElementType<Scalars, 'Int'>,
  speed?: ?$ElementType<Scalars, 'Int'>,
|};

declare type GatsbyTypes$BlurredOptions = {|
  /** Force the output format for the low-res preview. Default is to use the same format as the input. You should rarely need to change this */
  toFormat?: ?ImageFormat,
  /** Width of the generated low-res preview. Default is 20px */
  width?: ?$ElementType<Scalars, 'Int'>,
|};

declare type GatsbyTypes$BooleanQueryOperatorInput = {|
  eq?: ?$ElementType<Scalars, 'Boolean'>,
  in?: ?Array<?$ElementType<Scalars, 'Boolean'>>,
  ne?: ?$ElementType<Scalars, 'Boolean'>,
  nin?: ?Array<?$ElementType<Scalars, 'Boolean'>>,
|};


declare type GatsbyTypes$DateQueryOperatorInput = {|
  eq?: ?$ElementType<Scalars, 'Date'>,
  gt?: ?$ElementType<Scalars, 'Date'>,
  gte?: ?$ElementType<Scalars, 'Date'>,
  in?: ?Array<?$ElementType<Scalars, 'Date'>>,
  lt?: ?$ElementType<Scalars, 'Date'>,
  lte?: ?$ElementType<Scalars, 'Date'>,
  ne?: ?$ElementType<Scalars, 'Date'>,
  nin?: ?Array<?$ElementType<Scalars, 'Date'>>,
|};

declare type GatsbyTypes$Directory = {|
  ...GatsbyTypes$Node,
  ...{|
    +absolutePath: $ElementType<Scalars, 'String'>,
    +accessTime: $ElementType<Scalars, 'Date'>,
    +atime: $ElementType<Scalars, 'Date'>,
    +atimeMs: $ElementType<Scalars, 'Float'>,
    +base: $ElementType<Scalars, 'String'>,
    +birthTime: $ElementType<Scalars, 'Date'>,
    +birthtime?: ?$ElementType<Scalars, 'Date'>,
    +birthtimeMs?: ?$ElementType<Scalars, 'Float'>,
    +changeTime: $ElementType<Scalars, 'Date'>,
    +children: Array<GatsbyTypes$Node>,
    +ctime: $ElementType<Scalars, 'Date'>,
    +ctimeMs: $ElementType<Scalars, 'Float'>,
    +dev: $ElementType<Scalars, 'Int'>,
    +dir: $ElementType<Scalars, 'String'>,
    +ext: $ElementType<Scalars, 'String'>,
    +extension: $ElementType<Scalars, 'String'>,
    +gid: $ElementType<Scalars, 'Int'>,
    +id: $ElementType<Scalars, 'ID'>,
    +ino: $ElementType<Scalars, 'Float'>,
    +internal: GatsbyTypes$Internal,
    +mode: $ElementType<Scalars, 'Int'>,
    +modifiedTime: $ElementType<Scalars, 'Date'>,
    +mtime: $ElementType<Scalars, 'Date'>,
    +mtimeMs: $ElementType<Scalars, 'Float'>,
    +name: $ElementType<Scalars, 'String'>,
    +nlink: $ElementType<Scalars, 'Int'>,
    +parent?: ?GatsbyTypes$Node,
    +prettySize: $ElementType<Scalars, 'String'>,
    +rdev: $ElementType<Scalars, 'Int'>,
    +relativeDirectory: $ElementType<Scalars, 'String'>,
    +relativePath: $ElementType<Scalars, 'String'>,
    +root: $ElementType<Scalars, 'String'>,
    +size: $ElementType<Scalars, 'Int'>,
    +sourceInstanceName: $ElementType<Scalars, 'String'>,
    +uid: $ElementType<Scalars, 'Int'>,
  |}
|};


declare type GatsbyTypes$Directory_accessTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$Directory_atimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$Directory_birthTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$Directory_changeTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$Directory_ctimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$Directory_modifiedTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$Directory_mtimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$DirectoryConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$DirectoryEdge>,
  +group: Array<GatsbyTypes$DirectoryGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$Directory>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$DirectoryConnection_distinctArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};


declare type GatsbyTypes$DirectoryConnection_groupArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$DirectoryConnection_maxArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};


declare type GatsbyTypes$DirectoryConnection_minArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};


declare type GatsbyTypes$DirectoryConnection_sumArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};

declare type GatsbyTypes$DirectoryEdge = {|
  +next?: ?GatsbyTypes$Directory,
  +node: GatsbyTypes$Directory,
  +previous?: ?GatsbyTypes$Directory,
|};

export const GatsbyTypes$DirectoryFieldsEnumValues = Object.freeze({
  absolutePath: 'absolutePath',
  accessTime: 'accessTime',
  atime: 'atime',
  atimeMs: 'atimeMs',
  base: 'base',
  birthTime: 'birthTime',
  birthtime: 'birthtime',
  birthtimeMs: 'birthtimeMs',
  changeTime: 'changeTime',
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  ctime: 'ctime',
  ctimeMs: 'ctimeMs',
  dev: 'dev',
  dir: 'dir',
  ext: 'ext',
  extension: 'extension',
  gid: 'gid',
  id: 'id',
  ino: 'ino',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  mode: 'mode',
  modifiedTime: 'modifiedTime',
  mtime: 'mtime',
  mtimeMs: 'mtimeMs',
  name: 'name',
  nlink: 'nlink',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  prettySize: 'prettySize',
  rdev: 'rdev',
  relativeDirectory: 'relativeDirectory',
  relativePath: 'relativePath',
  root: 'root',
  size: 'size',
  sourceInstanceName: 'sourceInstanceName',
  uid: 'uid'
});


declare type GatsbyTypes$DirectoryFieldsEnum = $Values<typeof GatsbyTypes$DirectoryFieldsEnumValues>;

declare type GatsbyTypes$DirectoryFilterInput = {|
  absolutePath?: ?GatsbyTypes$StringQueryOperatorInput,
  accessTime?: ?GatsbyTypes$DateQueryOperatorInput,
  atime?: ?GatsbyTypes$DateQueryOperatorInput,
  atimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  base?: ?GatsbyTypes$StringQueryOperatorInput,
  birthTime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  changeTime?: ?GatsbyTypes$DateQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  ctime?: ?GatsbyTypes$DateQueryOperatorInput,
  ctimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  dev?: ?GatsbyTypes$IntQueryOperatorInput,
  dir?: ?GatsbyTypes$StringQueryOperatorInput,
  ext?: ?GatsbyTypes$StringQueryOperatorInput,
  extension?: ?GatsbyTypes$StringQueryOperatorInput,
  gid?: ?GatsbyTypes$IntQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  ino?: ?GatsbyTypes$FloatQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  mode?: ?GatsbyTypes$IntQueryOperatorInput,
  modifiedTime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  name?: ?GatsbyTypes$StringQueryOperatorInput,
  nlink?: ?GatsbyTypes$IntQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  prettySize?: ?GatsbyTypes$StringQueryOperatorInput,
  rdev?: ?GatsbyTypes$IntQueryOperatorInput,
  relativeDirectory?: ?GatsbyTypes$StringQueryOperatorInput,
  relativePath?: ?GatsbyTypes$StringQueryOperatorInput,
  root?: ?GatsbyTypes$StringQueryOperatorInput,
  size?: ?GatsbyTypes$IntQueryOperatorInput,
  sourceInstanceName?: ?GatsbyTypes$StringQueryOperatorInput,
  uid?: ?GatsbyTypes$IntQueryOperatorInput,
|};

declare type GatsbyTypes$DirectoryGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$DirectoryEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$DirectoryGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$Directory>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$DirectoryGroupConnection_distinctArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};


declare type GatsbyTypes$DirectoryGroupConnection_groupArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$DirectoryGroupConnection_maxArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};


declare type GatsbyTypes$DirectoryGroupConnection_minArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};


declare type GatsbyTypes$DirectoryGroupConnection_sumArgs = {|
  field: GatsbyTypes$DirectoryFieldsEnum,
|};

declare type GatsbyTypes$DirectorySortInput = {|
  fields?: ?Array<?DirectoryFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$DuotoneGradient = {|
  highlight: $ElementType<Scalars, 'String'>,
  opacity?: ?$ElementType<Scalars, 'Int'>,
  shadow: $ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$File = {|
  ...GatsbyTypes$Node,
  ...{|
    +absolutePath: $ElementType<Scalars, 'String'>,
    +accessTime: $ElementType<Scalars, 'Date'>,
    +atime: $ElementType<Scalars, 'Date'>,
    +atimeMs: $ElementType<Scalars, 'Float'>,
    +base: $ElementType<Scalars, 'String'>,
    +birthTime: $ElementType<Scalars, 'Date'>,
    +birthtime?: ?$ElementType<Scalars, 'Date'>,
    +birthtimeMs?: ?$ElementType<Scalars, 'Float'>,
    +blksize?: ?$ElementType<Scalars, 'Int'>,
    +blocks?: ?$ElementType<Scalars, 'Int'>,
    +changeTime: $ElementType<Scalars, 'Date'>,
    /** Returns the first child node of type ImageSharp or null if there are no children of given type on this node */
  +childImageSharp?: ?GatsbyTypes$ImageSharp,
    +children: Array<GatsbyTypes$Node>,
    /** Returns all children nodes filtered by type ImageSharp */
  +childrenImageSharp?: ?Array<?GatsbyTypes$ImageSharp>,
    +ctime: $ElementType<Scalars, 'Date'>,
    +ctimeMs: $ElementType<Scalars, 'Float'>,
    +dev: $ElementType<Scalars, 'Int'>,
    +dir: $ElementType<Scalars, 'String'>,
    +ext: $ElementType<Scalars, 'String'>,
    +extension: $ElementType<Scalars, 'String'>,
    +gid: $ElementType<Scalars, 'Int'>,
    +id: $ElementType<Scalars, 'ID'>,
    +ino: $ElementType<Scalars, 'Float'>,
    +internal: GatsbyTypes$Internal,
    +mode: $ElementType<Scalars, 'Int'>,
    +modifiedTime: $ElementType<Scalars, 'Date'>,
    +mtime: $ElementType<Scalars, 'Date'>,
    +mtimeMs: $ElementType<Scalars, 'Float'>,
    +name: $ElementType<Scalars, 'String'>,
    +nlink: $ElementType<Scalars, 'Int'>,
    +parent?: ?GatsbyTypes$Node,
    +prettySize: $ElementType<Scalars, 'String'>,
    /** Copy file to static directory and return public url to it */
  +publicURL?: ?$ElementType<Scalars, 'String'>,
    +rdev: $ElementType<Scalars, 'Int'>,
    +relativeDirectory: $ElementType<Scalars, 'String'>,
    +relativePath: $ElementType<Scalars, 'String'>,
    +root: $ElementType<Scalars, 'String'>,
    +size: $ElementType<Scalars, 'Int'>,
    +sourceInstanceName: $ElementType<Scalars, 'String'>,
    +uid: $ElementType<Scalars, 'Int'>,
  |}
|};


declare type GatsbyTypes$File_accessTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$File_atimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$File_birthTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$File_changeTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$File_ctimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$File_modifiedTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};


declare type GatsbyTypes$File_mtimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$FileConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$FileEdge>,
  +group: Array<GatsbyTypes$FileGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$File>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$FileConnection_distinctArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};


declare type GatsbyTypes$FileConnection_groupArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$FileConnection_maxArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};


declare type GatsbyTypes$FileConnection_minArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};


declare type GatsbyTypes$FileConnection_sumArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};

declare type GatsbyTypes$FileEdge = {|
  +next?: ?GatsbyTypes$File,
  +node: GatsbyTypes$File,
  +previous?: ?GatsbyTypes$File,
|};

export const GatsbyTypes$FileFieldsEnumValues = Object.freeze({
  absolutePath: 'absolutePath',
  accessTime: 'accessTime',
  atime: 'atime',
  atimeMs: 'atimeMs',
  base: 'base',
  birthTime: 'birthTime',
  birthtime: 'birthtime',
  birthtimeMs: 'birthtimeMs',
  blksize: 'blksize',
  blocks: 'blocks',
  changeTime: 'changeTime',
  childImageSharp___children: 'childImageSharp.children',
  childImageSharp___children___children: 'childImageSharp.children.children',
  childImageSharp___children___children___children: 'childImageSharp.children.children.children',
  childImageSharp___children___children___id: 'childImageSharp.children.children.id',
  childImageSharp___children___id: 'childImageSharp.children.id',
  childImageSharp___children___internal___content: 'childImageSharp.children.internal.content',
  childImageSharp___children___internal___contentDigest: 'childImageSharp.children.internal.contentDigest',
  childImageSharp___children___internal___description: 'childImageSharp.children.internal.description',
  childImageSharp___children___internal___fieldOwners: 'childImageSharp.children.internal.fieldOwners',
  childImageSharp___children___internal___ignoreType: 'childImageSharp.children.internal.ignoreType',
  childImageSharp___children___internal___mediaType: 'childImageSharp.children.internal.mediaType',
  childImageSharp___children___internal___owner: 'childImageSharp.children.internal.owner',
  childImageSharp___children___internal___type: 'childImageSharp.children.internal.type',
  childImageSharp___children___parent___children: 'childImageSharp.children.parent.children',
  childImageSharp___children___parent___id: 'childImageSharp.children.parent.id',
  childImageSharp___fixed___aspectRatio: 'childImageSharp.fixed.aspectRatio',
  childImageSharp___fixed___base64: 'childImageSharp.fixed.base64',
  childImageSharp___fixed___height: 'childImageSharp.fixed.height',
  childImageSharp___fixed___originalName: 'childImageSharp.fixed.originalName',
  childImageSharp___fixed___src: 'childImageSharp.fixed.src',
  childImageSharp___fixed___srcSet: 'childImageSharp.fixed.srcSet',
  childImageSharp___fixed___srcSetWebp: 'childImageSharp.fixed.srcSetWebp',
  childImageSharp___fixed___srcWebp: 'childImageSharp.fixed.srcWebp',
  childImageSharp___fixed___tracedSVG: 'childImageSharp.fixed.tracedSVG',
  childImageSharp___fixed___width: 'childImageSharp.fixed.width',
  childImageSharp___fluid___aspectRatio: 'childImageSharp.fluid.aspectRatio',
  childImageSharp___fluid___base64: 'childImageSharp.fluid.base64',
  childImageSharp___fluid___originalImg: 'childImageSharp.fluid.originalImg',
  childImageSharp___fluid___originalName: 'childImageSharp.fluid.originalName',
  childImageSharp___fluid___presentationHeight: 'childImageSharp.fluid.presentationHeight',
  childImageSharp___fluid___presentationWidth: 'childImageSharp.fluid.presentationWidth',
  childImageSharp___fluid___sizes: 'childImageSharp.fluid.sizes',
  childImageSharp___fluid___src: 'childImageSharp.fluid.src',
  childImageSharp___fluid___srcSet: 'childImageSharp.fluid.srcSet',
  childImageSharp___fluid___srcSetWebp: 'childImageSharp.fluid.srcSetWebp',
  childImageSharp___fluid___srcWebp: 'childImageSharp.fluid.srcWebp',
  childImageSharp___fluid___tracedSVG: 'childImageSharp.fluid.tracedSVG',
  childImageSharp___gatsbyImageData: 'childImageSharp.gatsbyImageData',
  childImageSharp___id: 'childImageSharp.id',
  childImageSharp___internal___content: 'childImageSharp.internal.content',
  childImageSharp___internal___contentDigest: 'childImageSharp.internal.contentDigest',
  childImageSharp___internal___description: 'childImageSharp.internal.description',
  childImageSharp___internal___fieldOwners: 'childImageSharp.internal.fieldOwners',
  childImageSharp___internal___ignoreType: 'childImageSharp.internal.ignoreType',
  childImageSharp___internal___mediaType: 'childImageSharp.internal.mediaType',
  childImageSharp___internal___owner: 'childImageSharp.internal.owner',
  childImageSharp___internal___type: 'childImageSharp.internal.type',
  childImageSharp___original___height: 'childImageSharp.original.height',
  childImageSharp___original___src: 'childImageSharp.original.src',
  childImageSharp___original___width: 'childImageSharp.original.width',
  childImageSharp___parent___children: 'childImageSharp.parent.children',
  childImageSharp___parent___children___children: 'childImageSharp.parent.children.children',
  childImageSharp___parent___children___id: 'childImageSharp.parent.children.id',
  childImageSharp___parent___id: 'childImageSharp.parent.id',
  childImageSharp___parent___internal___content: 'childImageSharp.parent.internal.content',
  childImageSharp___parent___internal___contentDigest: 'childImageSharp.parent.internal.contentDigest',
  childImageSharp___parent___internal___description: 'childImageSharp.parent.internal.description',
  childImageSharp___parent___internal___fieldOwners: 'childImageSharp.parent.internal.fieldOwners',
  childImageSharp___parent___internal___ignoreType: 'childImageSharp.parent.internal.ignoreType',
  childImageSharp___parent___internal___mediaType: 'childImageSharp.parent.internal.mediaType',
  childImageSharp___parent___internal___owner: 'childImageSharp.parent.internal.owner',
  childImageSharp___parent___internal___type: 'childImageSharp.parent.internal.type',
  childImageSharp___parent___parent___children: 'childImageSharp.parent.parent.children',
  childImageSharp___parent___parent___id: 'childImageSharp.parent.parent.id',
  childImageSharp___resize___aspectRatio: 'childImageSharp.resize.aspectRatio',
  childImageSharp___resize___height: 'childImageSharp.resize.height',
  childImageSharp___resize___originalName: 'childImageSharp.resize.originalName',
  childImageSharp___resize___src: 'childImageSharp.resize.src',
  childImageSharp___resize___tracedSVG: 'childImageSharp.resize.tracedSVG',
  childImageSharp___resize___width: 'childImageSharp.resize.width',
  children: 'children',
  childrenImageSharp: 'childrenImageSharp',
  childrenImageSharp___children: 'childrenImageSharp.children',
  childrenImageSharp___children___children: 'childrenImageSharp.children.children',
  childrenImageSharp___children___children___children: 'childrenImageSharp.children.children.children',
  childrenImageSharp___children___children___id: 'childrenImageSharp.children.children.id',
  childrenImageSharp___children___id: 'childrenImageSharp.children.id',
  childrenImageSharp___children___internal___content: 'childrenImageSharp.children.internal.content',
  childrenImageSharp___children___internal___contentDigest: 'childrenImageSharp.children.internal.contentDigest',
  childrenImageSharp___children___internal___description: 'childrenImageSharp.children.internal.description',
  childrenImageSharp___children___internal___fieldOwners: 'childrenImageSharp.children.internal.fieldOwners',
  childrenImageSharp___children___internal___ignoreType: 'childrenImageSharp.children.internal.ignoreType',
  childrenImageSharp___children___internal___mediaType: 'childrenImageSharp.children.internal.mediaType',
  childrenImageSharp___children___internal___owner: 'childrenImageSharp.children.internal.owner',
  childrenImageSharp___children___internal___type: 'childrenImageSharp.children.internal.type',
  childrenImageSharp___children___parent___children: 'childrenImageSharp.children.parent.children',
  childrenImageSharp___children___parent___id: 'childrenImageSharp.children.parent.id',
  childrenImageSharp___fixed___aspectRatio: 'childrenImageSharp.fixed.aspectRatio',
  childrenImageSharp___fixed___base64: 'childrenImageSharp.fixed.base64',
  childrenImageSharp___fixed___height: 'childrenImageSharp.fixed.height',
  childrenImageSharp___fixed___originalName: 'childrenImageSharp.fixed.originalName',
  childrenImageSharp___fixed___src: 'childrenImageSharp.fixed.src',
  childrenImageSharp___fixed___srcSet: 'childrenImageSharp.fixed.srcSet',
  childrenImageSharp___fixed___srcSetWebp: 'childrenImageSharp.fixed.srcSetWebp',
  childrenImageSharp___fixed___srcWebp: 'childrenImageSharp.fixed.srcWebp',
  childrenImageSharp___fixed___tracedSVG: 'childrenImageSharp.fixed.tracedSVG',
  childrenImageSharp___fixed___width: 'childrenImageSharp.fixed.width',
  childrenImageSharp___fluid___aspectRatio: 'childrenImageSharp.fluid.aspectRatio',
  childrenImageSharp___fluid___base64: 'childrenImageSharp.fluid.base64',
  childrenImageSharp___fluid___originalImg: 'childrenImageSharp.fluid.originalImg',
  childrenImageSharp___fluid___originalName: 'childrenImageSharp.fluid.originalName',
  childrenImageSharp___fluid___presentationHeight: 'childrenImageSharp.fluid.presentationHeight',
  childrenImageSharp___fluid___presentationWidth: 'childrenImageSharp.fluid.presentationWidth',
  childrenImageSharp___fluid___sizes: 'childrenImageSharp.fluid.sizes',
  childrenImageSharp___fluid___src: 'childrenImageSharp.fluid.src',
  childrenImageSharp___fluid___srcSet: 'childrenImageSharp.fluid.srcSet',
  childrenImageSharp___fluid___srcSetWebp: 'childrenImageSharp.fluid.srcSetWebp',
  childrenImageSharp___fluid___srcWebp: 'childrenImageSharp.fluid.srcWebp',
  childrenImageSharp___fluid___tracedSVG: 'childrenImageSharp.fluid.tracedSVG',
  childrenImageSharp___gatsbyImageData: 'childrenImageSharp.gatsbyImageData',
  childrenImageSharp___id: 'childrenImageSharp.id',
  childrenImageSharp___internal___content: 'childrenImageSharp.internal.content',
  childrenImageSharp___internal___contentDigest: 'childrenImageSharp.internal.contentDigest',
  childrenImageSharp___internal___description: 'childrenImageSharp.internal.description',
  childrenImageSharp___internal___fieldOwners: 'childrenImageSharp.internal.fieldOwners',
  childrenImageSharp___internal___ignoreType: 'childrenImageSharp.internal.ignoreType',
  childrenImageSharp___internal___mediaType: 'childrenImageSharp.internal.mediaType',
  childrenImageSharp___internal___owner: 'childrenImageSharp.internal.owner',
  childrenImageSharp___internal___type: 'childrenImageSharp.internal.type',
  childrenImageSharp___original___height: 'childrenImageSharp.original.height',
  childrenImageSharp___original___src: 'childrenImageSharp.original.src',
  childrenImageSharp___original___width: 'childrenImageSharp.original.width',
  childrenImageSharp___parent___children: 'childrenImageSharp.parent.children',
  childrenImageSharp___parent___children___children: 'childrenImageSharp.parent.children.children',
  childrenImageSharp___parent___children___id: 'childrenImageSharp.parent.children.id',
  childrenImageSharp___parent___id: 'childrenImageSharp.parent.id',
  childrenImageSharp___parent___internal___content: 'childrenImageSharp.parent.internal.content',
  childrenImageSharp___parent___internal___contentDigest: 'childrenImageSharp.parent.internal.contentDigest',
  childrenImageSharp___parent___internal___description: 'childrenImageSharp.parent.internal.description',
  childrenImageSharp___parent___internal___fieldOwners: 'childrenImageSharp.parent.internal.fieldOwners',
  childrenImageSharp___parent___internal___ignoreType: 'childrenImageSharp.parent.internal.ignoreType',
  childrenImageSharp___parent___internal___mediaType: 'childrenImageSharp.parent.internal.mediaType',
  childrenImageSharp___parent___internal___owner: 'childrenImageSharp.parent.internal.owner',
  childrenImageSharp___parent___internal___type: 'childrenImageSharp.parent.internal.type',
  childrenImageSharp___parent___parent___children: 'childrenImageSharp.parent.parent.children',
  childrenImageSharp___parent___parent___id: 'childrenImageSharp.parent.parent.id',
  childrenImageSharp___resize___aspectRatio: 'childrenImageSharp.resize.aspectRatio',
  childrenImageSharp___resize___height: 'childrenImageSharp.resize.height',
  childrenImageSharp___resize___originalName: 'childrenImageSharp.resize.originalName',
  childrenImageSharp___resize___src: 'childrenImageSharp.resize.src',
  childrenImageSharp___resize___tracedSVG: 'childrenImageSharp.resize.tracedSVG',
  childrenImageSharp___resize___width: 'childrenImageSharp.resize.width',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  ctime: 'ctime',
  ctimeMs: 'ctimeMs',
  dev: 'dev',
  dir: 'dir',
  ext: 'ext',
  extension: 'extension',
  gid: 'gid',
  id: 'id',
  ino: 'ino',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  mode: 'mode',
  modifiedTime: 'modifiedTime',
  mtime: 'mtime',
  mtimeMs: 'mtimeMs',
  name: 'name',
  nlink: 'nlink',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  prettySize: 'prettySize',
  publicURL: 'publicURL',
  rdev: 'rdev',
  relativeDirectory: 'relativeDirectory',
  relativePath: 'relativePath',
  root: 'root',
  size: 'size',
  sourceInstanceName: 'sourceInstanceName',
  uid: 'uid'
});


declare type GatsbyTypes$FileFieldsEnum = $Values<typeof GatsbyTypes$FileFieldsEnumValues>;

declare type GatsbyTypes$FileFilterInput = {|
  absolutePath?: ?GatsbyTypes$StringQueryOperatorInput,
  accessTime?: ?GatsbyTypes$DateQueryOperatorInput,
  atime?: ?GatsbyTypes$DateQueryOperatorInput,
  atimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  base?: ?GatsbyTypes$StringQueryOperatorInput,
  birthTime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  blksize?: ?GatsbyTypes$IntQueryOperatorInput,
  blocks?: ?GatsbyTypes$IntQueryOperatorInput,
  changeTime?: ?GatsbyTypes$DateQueryOperatorInput,
  childImageSharp?: ?GatsbyTypes$ImageSharpFilterInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  childrenImageSharp?: ?GatsbyTypes$ImageSharpFilterListInput,
  ctime?: ?GatsbyTypes$DateQueryOperatorInput,
  ctimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  dev?: ?GatsbyTypes$IntQueryOperatorInput,
  dir?: ?GatsbyTypes$StringQueryOperatorInput,
  ext?: ?GatsbyTypes$StringQueryOperatorInput,
  extension?: ?GatsbyTypes$StringQueryOperatorInput,
  gid?: ?GatsbyTypes$IntQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  ino?: ?GatsbyTypes$FloatQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  mode?: ?GatsbyTypes$IntQueryOperatorInput,
  modifiedTime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  name?: ?GatsbyTypes$StringQueryOperatorInput,
  nlink?: ?GatsbyTypes$IntQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  prettySize?: ?GatsbyTypes$StringQueryOperatorInput,
  publicURL?: ?GatsbyTypes$StringQueryOperatorInput,
  rdev?: ?GatsbyTypes$IntQueryOperatorInput,
  relativeDirectory?: ?GatsbyTypes$StringQueryOperatorInput,
  relativePath?: ?GatsbyTypes$StringQueryOperatorInput,
  root?: ?GatsbyTypes$StringQueryOperatorInput,
  size?: ?GatsbyTypes$IntQueryOperatorInput,
  sourceInstanceName?: ?GatsbyTypes$StringQueryOperatorInput,
  uid?: ?GatsbyTypes$IntQueryOperatorInput,
|};

declare type GatsbyTypes$FileGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$FileEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$FileGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$File>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$FileGroupConnection_distinctArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};


declare type GatsbyTypes$FileGroupConnection_groupArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$FileGroupConnection_maxArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};


declare type GatsbyTypes$FileGroupConnection_minArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};


declare type GatsbyTypes$FileGroupConnection_sumArgs = {|
  field: GatsbyTypes$FileFieldsEnum,
|};

declare type GatsbyTypes$FileSortInput = {|
  fields?: ?Array<?FileFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$FloatQueryOperatorInput = {|
  eq?: ?$ElementType<Scalars, 'Float'>,
  gt?: ?$ElementType<Scalars, 'Float'>,
  gte?: ?$ElementType<Scalars, 'Float'>,
  in?: ?Array<?$ElementType<Scalars, 'Float'>>,
  lt?: ?$ElementType<Scalars, 'Float'>,
  lte?: ?$ElementType<Scalars, 'Float'>,
  ne?: ?$ElementType<Scalars, 'Float'>,
  nin?: ?Array<?$ElementType<Scalars, 'Float'>>,
|};

export const GatsbyTypes$GatsbyImageFormatValues = Object.freeze({
  AUTO: 'auto',
  AVIF: 'avif',
  JPG: 'jpg',
  NO_CHANGE: 'NO_CHANGE',
  PNG: 'png',
  WEBP: 'webp'
});


declare type GatsbyTypes$GatsbyImageFormat = $Values<typeof GatsbyTypes$GatsbyImageFormatValues>;

export const GatsbyTypes$GatsbyImageLayoutValues = Object.freeze({
  CONSTRAINED: 'constrained',
  FIXED: 'fixed',
  FULL_WIDTH: 'fullWidth'
});


declare type GatsbyTypes$GatsbyImageLayout = $Values<typeof GatsbyTypes$GatsbyImageLayoutValues>;

export const GatsbyTypes$GatsbyImagePlaceholderValues = Object.freeze({
  BLURRED: 'blurred',
  DOMINANT_COLOR: 'dominantColor',
  NONE: 'none',
  TRACED_SVG: 'tracedSVG'
});


declare type GatsbyTypes$GatsbyImagePlaceholder = $Values<typeof GatsbyTypes$GatsbyImagePlaceholderValues>;

export const GatsbyTypes$ImageCropFocusValues = Object.freeze({
  ATTENTION: 17,
  CENTER: 'CENTER',
  EAST: 2,
  ENTROPY: 16,
  NORTH: 1,
  NORTHEAST: 5,
  NORTHWEST: 8,
  SOUTH: 3,
  SOUTHEAST: 6,
  SOUTHWEST: 7,
  WEST: 4
});


declare type GatsbyTypes$ImageCropFocus = $Values<typeof GatsbyTypes$ImageCropFocusValues>;

export const GatsbyTypes$ImageFitValues = Object.freeze({
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  INSIDE: 'inside',
  OUTSIDE: 'outside'
});


declare type GatsbyTypes$ImageFit = $Values<typeof GatsbyTypes$ImageFitValues>;

export const GatsbyTypes$ImageFormatValues = Object.freeze({
  AUTO: 'AUTO',
  AVIF: 'avif',
  JPG: 'jpg',
  NO_CHANGE: 'NO_CHANGE',
  PNG: 'png',
  WEBP: 'webp'
});


declare type GatsbyTypes$ImageFormat = $Values<typeof GatsbyTypes$ImageFormatValues>;

export const GatsbyTypes$ImageLayoutValues = Object.freeze({
  CONSTRAINED: 'constrained',
  FIXED: 'fixed',
  FULL_WIDTH: 'fullWidth'
});


declare type GatsbyTypes$ImageLayout = $Values<typeof GatsbyTypes$ImageLayoutValues>;

export const GatsbyTypes$ImagePlaceholderValues = Object.freeze({
  BLURRED: 'blurred',
  DOMINANT_COLOR: 'dominantColor',
  NONE: 'none',
  TRACED_SVG: 'tracedSVG'
});


declare type GatsbyTypes$ImagePlaceholder = $Values<typeof GatsbyTypes$ImagePlaceholderValues>;

declare type GatsbyTypes$ImageSharp = {|
  ...GatsbyTypes$Node,
  ...{|
    +children: Array<GatsbyTypes$Node>,
    +fixed?: ?GatsbyTypes$ImageSharpFixed,
    +fluid?: ?GatsbyTypes$ImageSharpFluid,
    +gatsbyImageData: $ElementType<Scalars, 'JSON'>,
    +id: $ElementType<Scalars, 'ID'>,
    +internal: GatsbyTypes$Internal,
    +original?: ?GatsbyTypes$ImageSharpOriginal,
    +parent?: ?GatsbyTypes$Node,
    +resize?: ?GatsbyTypes$ImageSharpResize,
  |}
|};


declare type GatsbyTypes$ImageSharp_fixedArgs = {|
  background: $ElementType<Scalars, 'String'>,
  base64Width?: ?$ElementType<Scalars, 'Int'>,
  cropFocus: GatsbyTypes$ImageCropFocus,
  duotone: GatsbyTypes$DuotoneGradient,
  fit: GatsbyTypes$ImageFit,
  grayscale: $ElementType<Scalars, 'Boolean'>,
  height?: ?$ElementType<Scalars, 'Int'>,
  jpegProgressive: $ElementType<Scalars, 'Boolean'>,
  jpegQuality?: ?$ElementType<Scalars, 'Int'>,
  pngCompressionSpeed: $ElementType<Scalars, 'Int'>,
  pngQuality?: ?$ElementType<Scalars, 'Int'>,
  quality?: ?$ElementType<Scalars, 'Int'>,
  rotate: $ElementType<Scalars, 'Int'>,
  toFormat: GatsbyTypes$ImageFormat,
  toFormatBase64: GatsbyTypes$ImageFormat,
  traceSVG: GatsbyTypes$Potrace,
  trim: $ElementType<Scalars, 'Float'>,
  webpQuality?: ?$ElementType<Scalars, 'Int'>,
  width?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharp_fluidArgs = {|
  background: $ElementType<Scalars, 'String'>,
  base64Width?: ?$ElementType<Scalars, 'Int'>,
  cropFocus: GatsbyTypes$ImageCropFocus,
  duotone: GatsbyTypes$DuotoneGradient,
  fit: GatsbyTypes$ImageFit,
  grayscale: $ElementType<Scalars, 'Boolean'>,
  jpegProgressive: $ElementType<Scalars, 'Boolean'>,
  jpegQuality?: ?$ElementType<Scalars, 'Int'>,
  maxHeight?: ?$ElementType<Scalars, 'Int'>,
  maxWidth?: ?$ElementType<Scalars, 'Int'>,
  pngCompressionSpeed: $ElementType<Scalars, 'Int'>,
  pngQuality?: ?$ElementType<Scalars, 'Int'>,
  quality?: ?$ElementType<Scalars, 'Int'>,
  rotate: $ElementType<Scalars, 'Int'>,
  sizes: $ElementType<Scalars, 'String'>,
  srcSetBreakpoints: Array<?$ElementType<Scalars, 'Int'>>,
  toFormat: GatsbyTypes$ImageFormat,
  toFormatBase64: GatsbyTypes$ImageFormat,
  traceSVG: GatsbyTypes$Potrace,
  trim: $ElementType<Scalars, 'Float'>,
  webpQuality?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharp_gatsbyImageDataArgs = {|
  aspectRatio?: ?$ElementType<Scalars, 'Float'>,
  avifOptions?: ?GatsbyTypes$AVIFOptions,
  backgroundColor?: ?$ElementType<Scalars, 'String'>,
  blurredOptions?: ?GatsbyTypes$BlurredOptions,
  breakpoints?: ?Array<?$ElementType<Scalars, 'Int'>>,
  formats?: ?Array<?GatsbyTypes$ImageFormat>,
  height?: ?$ElementType<Scalars, 'Int'>,
  jpgOptions?: ?GatsbyTypes$JPGOptions,
  layout: GatsbyTypes$ImageLayout,
  outputPixelDensities?: ?Array<?$ElementType<Scalars, 'Float'>>,
  placeholder?: ?GatsbyTypes$ImagePlaceholder,
  pngOptions?: ?GatsbyTypes$PNGOptions,
  quality?: ?$ElementType<Scalars, 'Int'>,
  sizes?: ?$ElementType<Scalars, 'String'>,
  tracedSVGOptions?: ?GatsbyTypes$Potrace,
  transformOptions?: ?GatsbyTypes$TransformOptions,
  webpOptions?: ?GatsbyTypes$WebPOptions,
  width?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharp_resizeArgs = {|
  background: $ElementType<Scalars, 'String'>,
  base64: $ElementType<Scalars, 'Boolean'>,
  cropFocus: GatsbyTypes$ImageCropFocus,
  duotone: GatsbyTypes$DuotoneGradient,
  fit: GatsbyTypes$ImageFit,
  grayscale: $ElementType<Scalars, 'Boolean'>,
  height?: ?$ElementType<Scalars, 'Int'>,
  jpegProgressive: $ElementType<Scalars, 'Boolean'>,
  jpegQuality?: ?$ElementType<Scalars, 'Int'>,
  pngCompressionLevel: $ElementType<Scalars, 'Int'>,
  pngCompressionSpeed: $ElementType<Scalars, 'Int'>,
  pngQuality?: ?$ElementType<Scalars, 'Int'>,
  quality?: ?$ElementType<Scalars, 'Int'>,
  rotate: $ElementType<Scalars, 'Int'>,
  toFormat: GatsbyTypes$ImageFormat,
  traceSVG: GatsbyTypes$Potrace,
  trim: $ElementType<Scalars, 'Float'>,
  webpQuality?: ?$ElementType<Scalars, 'Int'>,
  width?: ?$ElementType<Scalars, 'Int'>,
|};

declare type GatsbyTypes$ImageSharpConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$ImageSharpEdge>,
  +group: Array<GatsbyTypes$ImageSharpGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$ImageSharp>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharpConnection_distinctArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};


declare type GatsbyTypes$ImageSharpConnection_groupArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharpConnection_maxArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};


declare type GatsbyTypes$ImageSharpConnection_minArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};


declare type GatsbyTypes$ImageSharpConnection_sumArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};

declare type GatsbyTypes$ImageSharpEdge = {|
  +next?: ?GatsbyTypes$ImageSharp,
  +node: GatsbyTypes$ImageSharp,
  +previous?: ?GatsbyTypes$ImageSharp,
|};

export const GatsbyTypes$ImageSharpFieldsEnumValues = Object.freeze({
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  fixed___aspectRatio: 'fixed.aspectRatio',
  fixed___base64: 'fixed.base64',
  fixed___height: 'fixed.height',
  fixed___originalName: 'fixed.originalName',
  fixed___src: 'fixed.src',
  fixed___srcSet: 'fixed.srcSet',
  fixed___srcSetWebp: 'fixed.srcSetWebp',
  fixed___srcWebp: 'fixed.srcWebp',
  fixed___tracedSVG: 'fixed.tracedSVG',
  fixed___width: 'fixed.width',
  fluid___aspectRatio: 'fluid.aspectRatio',
  fluid___base64: 'fluid.base64',
  fluid___originalImg: 'fluid.originalImg',
  fluid___originalName: 'fluid.originalName',
  fluid___presentationHeight: 'fluid.presentationHeight',
  fluid___presentationWidth: 'fluid.presentationWidth',
  fluid___sizes: 'fluid.sizes',
  fluid___src: 'fluid.src',
  fluid___srcSet: 'fluid.srcSet',
  fluid___srcSetWebp: 'fluid.srcSetWebp',
  fluid___srcWebp: 'fluid.srcWebp',
  fluid___tracedSVG: 'fluid.tracedSVG',
  gatsbyImageData: 'gatsbyImageData',
  id: 'id',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  original___height: 'original.height',
  original___src: 'original.src',
  original___width: 'original.width',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  resize___aspectRatio: 'resize.aspectRatio',
  resize___height: 'resize.height',
  resize___originalName: 'resize.originalName',
  resize___src: 'resize.src',
  resize___tracedSVG: 'resize.tracedSVG',
  resize___width: 'resize.width'
});


declare type GatsbyTypes$ImageSharpFieldsEnum = $Values<typeof GatsbyTypes$ImageSharpFieldsEnumValues>;

declare type GatsbyTypes$ImageSharpFilterInput = {|
  children?: ?GatsbyTypes$NodeFilterListInput,
  fixed?: ?GatsbyTypes$ImageSharpFixedFilterInput,
  fluid?: ?GatsbyTypes$ImageSharpFluidFilterInput,
  gatsbyImageData?: ?GatsbyTypes$JSONQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  original?: ?GatsbyTypes$ImageSharpOriginalFilterInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  resize?: ?GatsbyTypes$ImageSharpResizeFilterInput,
|};

declare type GatsbyTypes$ImageSharpFilterListInput = {|
  elemMatch?: ?GatsbyTypes$ImageSharpFilterInput,
|};

declare type GatsbyTypes$ImageSharpFixed = {|
  +aspectRatio?: ?$ElementType<Scalars, 'Float'>,
  +base64?: ?$ElementType<Scalars, 'String'>,
  +height: $ElementType<Scalars, 'Float'>,
  +originalName?: ?$ElementType<Scalars, 'String'>,
  +src: $ElementType<Scalars, 'String'>,
  +srcSet: $ElementType<Scalars, 'String'>,
  +srcSetWebp?: ?$ElementType<Scalars, 'String'>,
  +srcWebp?: ?$ElementType<Scalars, 'String'>,
  +tracedSVG?: ?$ElementType<Scalars, 'String'>,
  +width: $ElementType<Scalars, 'Float'>,
|};

declare type GatsbyTypes$ImageSharpFixedFilterInput = {|
  aspectRatio?: ?GatsbyTypes$FloatQueryOperatorInput,
  base64?: ?GatsbyTypes$StringQueryOperatorInput,
  height?: ?GatsbyTypes$FloatQueryOperatorInput,
  originalName?: ?GatsbyTypes$StringQueryOperatorInput,
  src?: ?GatsbyTypes$StringQueryOperatorInput,
  srcSet?: ?GatsbyTypes$StringQueryOperatorInput,
  srcSetWebp?: ?GatsbyTypes$StringQueryOperatorInput,
  srcWebp?: ?GatsbyTypes$StringQueryOperatorInput,
  tracedSVG?: ?GatsbyTypes$StringQueryOperatorInput,
  width?: ?GatsbyTypes$FloatQueryOperatorInput,
|};

declare type GatsbyTypes$ImageSharpFluid = {|
  +aspectRatio: $ElementType<Scalars, 'Float'>,
  +base64?: ?$ElementType<Scalars, 'String'>,
  +originalImg?: ?$ElementType<Scalars, 'String'>,
  +originalName?: ?$ElementType<Scalars, 'String'>,
  +presentationHeight: $ElementType<Scalars, 'Int'>,
  +presentationWidth: $ElementType<Scalars, 'Int'>,
  +sizes: $ElementType<Scalars, 'String'>,
  +src: $ElementType<Scalars, 'String'>,
  +srcSet: $ElementType<Scalars, 'String'>,
  +srcSetWebp?: ?$ElementType<Scalars, 'String'>,
  +srcWebp?: ?$ElementType<Scalars, 'String'>,
  +tracedSVG?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$ImageSharpFluidFilterInput = {|
  aspectRatio?: ?GatsbyTypes$FloatQueryOperatorInput,
  base64?: ?GatsbyTypes$StringQueryOperatorInput,
  originalImg?: ?GatsbyTypes$StringQueryOperatorInput,
  originalName?: ?GatsbyTypes$StringQueryOperatorInput,
  presentationHeight?: ?GatsbyTypes$IntQueryOperatorInput,
  presentationWidth?: ?GatsbyTypes$IntQueryOperatorInput,
  sizes?: ?GatsbyTypes$StringQueryOperatorInput,
  src?: ?GatsbyTypes$StringQueryOperatorInput,
  srcSet?: ?GatsbyTypes$StringQueryOperatorInput,
  srcSetWebp?: ?GatsbyTypes$StringQueryOperatorInput,
  srcWebp?: ?GatsbyTypes$StringQueryOperatorInput,
  tracedSVG?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$ImageSharpGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$ImageSharpEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$ImageSharpGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$ImageSharp>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharpGroupConnection_distinctArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};


declare type GatsbyTypes$ImageSharpGroupConnection_groupArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$ImageSharpGroupConnection_maxArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};


declare type GatsbyTypes$ImageSharpGroupConnection_minArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};


declare type GatsbyTypes$ImageSharpGroupConnection_sumArgs = {|
  field: GatsbyTypes$ImageSharpFieldsEnum,
|};

declare type GatsbyTypes$ImageSharpOriginal = {|
  +height?: ?$ElementType<Scalars, 'Float'>,
  +src?: ?$ElementType<Scalars, 'String'>,
  +width?: ?$ElementType<Scalars, 'Float'>,
|};

declare type GatsbyTypes$ImageSharpOriginalFilterInput = {|
  height?: ?GatsbyTypes$FloatQueryOperatorInput,
  src?: ?GatsbyTypes$StringQueryOperatorInput,
  width?: ?GatsbyTypes$FloatQueryOperatorInput,
|};

declare type GatsbyTypes$ImageSharpResize = {|
  +aspectRatio?: ?$ElementType<Scalars, 'Float'>,
  +height?: ?$ElementType<Scalars, 'Int'>,
  +originalName?: ?$ElementType<Scalars, 'String'>,
  +src?: ?$ElementType<Scalars, 'String'>,
  +tracedSVG?: ?$ElementType<Scalars, 'String'>,
  +width?: ?$ElementType<Scalars, 'Int'>,
|};

declare type GatsbyTypes$ImageSharpResizeFilterInput = {|
  aspectRatio?: ?GatsbyTypes$FloatQueryOperatorInput,
  height?: ?GatsbyTypes$IntQueryOperatorInput,
  originalName?: ?GatsbyTypes$StringQueryOperatorInput,
  src?: ?GatsbyTypes$StringQueryOperatorInput,
  tracedSVG?: ?GatsbyTypes$StringQueryOperatorInput,
  width?: ?GatsbyTypes$IntQueryOperatorInput,
|};

declare type GatsbyTypes$ImageSharpSortInput = {|
  fields?: ?Array<?ImageSharpFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$IntQueryOperatorInput = {|
  eq?: ?$ElementType<Scalars, 'Int'>,
  gt?: ?$ElementType<Scalars, 'Int'>,
  gte?: ?$ElementType<Scalars, 'Int'>,
  in?: ?Array<?$ElementType<Scalars, 'Int'>>,
  lt?: ?$ElementType<Scalars, 'Int'>,
  lte?: ?$ElementType<Scalars, 'Int'>,
  ne?: ?$ElementType<Scalars, 'Int'>,
  nin?: ?Array<?$ElementType<Scalars, 'Int'>>,
|};

declare type GatsbyTypes$Internal = {|
  +content?: ?$ElementType<Scalars, 'String'>,
  +contentDigest: $ElementType<Scalars, 'String'>,
  +description?: ?$ElementType<Scalars, 'String'>,
  +fieldOwners?: ?Array<?$ElementType<Scalars, 'String'>>,
  +ignoreType?: ?$ElementType<Scalars, 'Boolean'>,
  +mediaType?: ?$ElementType<Scalars, 'String'>,
  +owner: $ElementType<Scalars, 'String'>,
  +type: $ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$InternalFilterInput = {|
  content?: ?GatsbyTypes$StringQueryOperatorInput,
  contentDigest?: ?GatsbyTypes$StringQueryOperatorInput,
  description?: ?GatsbyTypes$StringQueryOperatorInput,
  fieldOwners?: ?GatsbyTypes$StringQueryOperatorInput,
  ignoreType?: ?GatsbyTypes$BooleanQueryOperatorInput,
  mediaType?: ?GatsbyTypes$StringQueryOperatorInput,
  owner?: ?GatsbyTypes$StringQueryOperatorInput,
  type?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$JPGOptions = {|
  progressive?: ?$ElementType<Scalars, 'Boolean'>,
  quality?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$JSONQueryOperatorInput = {|
  eq?: ?$ElementType<Scalars, 'JSON'>,
  glob?: ?$ElementType<Scalars, 'JSON'>,
  in?: ?Array<?$ElementType<Scalars, 'JSON'>>,
  ne?: ?$ElementType<Scalars, 'JSON'>,
  nin?: ?Array<?$ElementType<Scalars, 'JSON'>>,
  regex?: ?$ElementType<Scalars, 'JSON'>,
|};

/** Node Interface */
declare type GatsbyTypes$Node = {|
  +children: Array<GatsbyTypes$Node>,
  +id: $ElementType<Scalars, 'ID'>,
  +internal: GatsbyTypes$Internal,
  +parent?: ?GatsbyTypes$Node,
|};

declare type GatsbyTypes$NodeFilterInput = {|
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
|};

declare type GatsbyTypes$NodeFilterListInput = {|
  elemMatch?: ?GatsbyTypes$NodeFilterInput,
|};

declare type GatsbyTypes$PNGOptions = {|
  compressionSpeed?: ?$ElementType<Scalars, 'Int'>,
  quality?: ?$ElementType<Scalars, 'Int'>,
|};

declare type GatsbyTypes$PageInfo = {|
  +currentPage: $ElementType<Scalars, 'Int'>,
  +hasNextPage: $ElementType<Scalars, 'Boolean'>,
  +hasPreviousPage: $ElementType<Scalars, 'Boolean'>,
  +itemCount: $ElementType<Scalars, 'Int'>,
  +pageCount: $ElementType<Scalars, 'Int'>,
  +perPage?: ?$ElementType<Scalars, 'Int'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};

declare type GatsbyTypes$Potrace = {|
  alphaMax?: ?$ElementType<Scalars, 'Float'>,
  background?: ?$ElementType<Scalars, 'String'>,
  blackOnWhite?: ?$ElementType<Scalars, 'Boolean'>,
  color?: ?$ElementType<Scalars, 'String'>,
  optCurve?: ?$ElementType<Scalars, 'Boolean'>,
  optTolerance?: ?$ElementType<Scalars, 'Float'>,
  threshold?: ?$ElementType<Scalars, 'Int'>,
  turdSize?: ?$ElementType<Scalars, 'Float'>,
  turnPolicy?: ?PotraceTurnPolicy,
|};

export const GatsbyTypes$PotraceTurnPolicyValues = Object.freeze({
  TURNPOLICY_BLACK: 'black',
  TURNPOLICY_LEFT: 'left',
  TURNPOLICY_MAJORITY: 'majority',
  TURNPOLICY_MINORITY: 'minority',
  TURNPOLICY_RIGHT: 'right',
  TURNPOLICY_WHITE: 'white'
});


declare type GatsbyTypes$PotraceTurnPolicy = $Values<typeof GatsbyTypes$PotraceTurnPolicyValues>;

declare type GatsbyTypes$Query = {|
  +allDirectory: GatsbyTypes$DirectoryConnection,
  +allFile: GatsbyTypes$FileConnection,
  +allImageSharp: GatsbyTypes$ImageSharpConnection,
  +allSite: GatsbyTypes$SiteConnection,
  +allSiteBuildMetadata: GatsbyTypes$SiteBuildMetadataConnection,
  +allSiteFunction: GatsbyTypes$SiteFunctionConnection,
  +allSitePage: GatsbyTypes$SitePageConnection,
  +allSitePlugin: GatsbyTypes$SitePluginConnection,
  +directory?: ?GatsbyTypes$Directory,
  +file?: ?GatsbyTypes$File,
  +imageSharp?: ?GatsbyTypes$ImageSharp,
  +site?: ?GatsbyTypes$Site,
  +siteBuildMetadata?: ?GatsbyTypes$SiteBuildMetadata,
  +siteFunction?: ?GatsbyTypes$SiteFunction,
  +sitePage?: ?GatsbyTypes$SitePage,
  +sitePlugin?: ?GatsbyTypes$SitePlugin,
|};


declare type GatsbyTypes$Query_allDirectoryArgs = {|
  filter?: ?GatsbyTypes$DirectoryFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$DirectorySortInput,
|};


declare type GatsbyTypes$Query_allFileArgs = {|
  filter?: ?GatsbyTypes$FileFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$FileSortInput,
|};


declare type GatsbyTypes$Query_allImageSharpArgs = {|
  filter?: ?GatsbyTypes$ImageSharpFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$ImageSharpSortInput,
|};


declare type GatsbyTypes$Query_allSiteArgs = {|
  filter?: ?GatsbyTypes$SiteFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$SiteSortInput,
|};


declare type GatsbyTypes$Query_allSiteBuildMetadataArgs = {|
  filter?: ?GatsbyTypes$SiteBuildMetadataFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$SiteBuildMetadataSortInput,
|};


declare type GatsbyTypes$Query_allSiteFunctionArgs = {|
  filter?: ?GatsbyTypes$SiteFunctionFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$SiteFunctionSortInput,
|};


declare type GatsbyTypes$Query_allSitePageArgs = {|
  filter?: ?GatsbyTypes$SitePageFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$SitePageSortInput,
|};


declare type GatsbyTypes$Query_allSitePluginArgs = {|
  filter?: ?GatsbyTypes$SitePluginFilterInput,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
  sort?: ?GatsbyTypes$SitePluginSortInput,
|};


declare type GatsbyTypes$Query_directoryArgs = {|
  absolutePath?: ?GatsbyTypes$StringQueryOperatorInput,
  accessTime?: ?GatsbyTypes$DateQueryOperatorInput,
  atime?: ?GatsbyTypes$DateQueryOperatorInput,
  atimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  base?: ?GatsbyTypes$StringQueryOperatorInput,
  birthTime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  changeTime?: ?GatsbyTypes$DateQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  ctime?: ?GatsbyTypes$DateQueryOperatorInput,
  ctimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  dev?: ?GatsbyTypes$IntQueryOperatorInput,
  dir?: ?GatsbyTypes$StringQueryOperatorInput,
  ext?: ?GatsbyTypes$StringQueryOperatorInput,
  extension?: ?GatsbyTypes$StringQueryOperatorInput,
  gid?: ?GatsbyTypes$IntQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  ino?: ?GatsbyTypes$FloatQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  mode?: ?GatsbyTypes$IntQueryOperatorInput,
  modifiedTime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  name?: ?GatsbyTypes$StringQueryOperatorInput,
  nlink?: ?GatsbyTypes$IntQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  prettySize?: ?GatsbyTypes$StringQueryOperatorInput,
  rdev?: ?GatsbyTypes$IntQueryOperatorInput,
  relativeDirectory?: ?GatsbyTypes$StringQueryOperatorInput,
  relativePath?: ?GatsbyTypes$StringQueryOperatorInput,
  root?: ?GatsbyTypes$StringQueryOperatorInput,
  size?: ?GatsbyTypes$IntQueryOperatorInput,
  sourceInstanceName?: ?GatsbyTypes$StringQueryOperatorInput,
  uid?: ?GatsbyTypes$IntQueryOperatorInput,
|};


declare type GatsbyTypes$Query_fileArgs = {|
  absolutePath?: ?GatsbyTypes$StringQueryOperatorInput,
  accessTime?: ?GatsbyTypes$DateQueryOperatorInput,
  atime?: ?GatsbyTypes$DateQueryOperatorInput,
  atimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  base?: ?GatsbyTypes$StringQueryOperatorInput,
  birthTime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtime?: ?GatsbyTypes$DateQueryOperatorInput,
  birthtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  blksize?: ?GatsbyTypes$IntQueryOperatorInput,
  blocks?: ?GatsbyTypes$IntQueryOperatorInput,
  changeTime?: ?GatsbyTypes$DateQueryOperatorInput,
  childImageSharp?: ?GatsbyTypes$ImageSharpFilterInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  childrenImageSharp?: ?GatsbyTypes$ImageSharpFilterListInput,
  ctime?: ?GatsbyTypes$DateQueryOperatorInput,
  ctimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  dev?: ?GatsbyTypes$IntQueryOperatorInput,
  dir?: ?GatsbyTypes$StringQueryOperatorInput,
  ext?: ?GatsbyTypes$StringQueryOperatorInput,
  extension?: ?GatsbyTypes$StringQueryOperatorInput,
  gid?: ?GatsbyTypes$IntQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  ino?: ?GatsbyTypes$FloatQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  mode?: ?GatsbyTypes$IntQueryOperatorInput,
  modifiedTime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtime?: ?GatsbyTypes$DateQueryOperatorInput,
  mtimeMs?: ?GatsbyTypes$FloatQueryOperatorInput,
  name?: ?GatsbyTypes$StringQueryOperatorInput,
  nlink?: ?GatsbyTypes$IntQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  prettySize?: ?GatsbyTypes$StringQueryOperatorInput,
  publicURL?: ?GatsbyTypes$StringQueryOperatorInput,
  rdev?: ?GatsbyTypes$IntQueryOperatorInput,
  relativeDirectory?: ?GatsbyTypes$StringQueryOperatorInput,
  relativePath?: ?GatsbyTypes$StringQueryOperatorInput,
  root?: ?GatsbyTypes$StringQueryOperatorInput,
  size?: ?GatsbyTypes$IntQueryOperatorInput,
  sourceInstanceName?: ?GatsbyTypes$StringQueryOperatorInput,
  uid?: ?GatsbyTypes$IntQueryOperatorInput,
|};


declare type GatsbyTypes$Query_imageSharpArgs = {|
  children?: ?GatsbyTypes$NodeFilterListInput,
  fixed?: ?GatsbyTypes$ImageSharpFixedFilterInput,
  fluid?: ?GatsbyTypes$ImageSharpFluidFilterInput,
  gatsbyImageData?: ?GatsbyTypes$JSONQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  original?: ?GatsbyTypes$ImageSharpOriginalFilterInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  resize?: ?GatsbyTypes$ImageSharpResizeFilterInput,
|};


declare type GatsbyTypes$Query_siteArgs = {|
  buildTime?: ?GatsbyTypes$DateQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  jsxRuntime?: ?GatsbyTypes$StringQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  pathPrefix?: ?GatsbyTypes$StringQueryOperatorInput,
  polyfill?: ?GatsbyTypes$BooleanQueryOperatorInput,
  siteMetadata?: ?GatsbyTypes$SiteSiteMetadataFilterInput,
  trailingSlash?: ?GatsbyTypes$StringQueryOperatorInput,
|};


declare type GatsbyTypes$Query_siteBuildMetadataArgs = {|
  buildTime?: ?GatsbyTypes$DateQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
|};


declare type GatsbyTypes$Query_siteFunctionArgs = {|
  absoluteCompiledFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  functionRoute?: ?GatsbyTypes$StringQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  matchPath?: ?GatsbyTypes$StringQueryOperatorInput,
  originalAbsoluteFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
  originalRelativeFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  pluginName?: ?GatsbyTypes$StringQueryOperatorInput,
  relativeCompiledFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
|};


declare type GatsbyTypes$Query_sitePageArgs = {|
  children?: ?GatsbyTypes$NodeFilterListInput,
  component?: ?GatsbyTypes$StringQueryOperatorInput,
  componentChunkName?: ?GatsbyTypes$StringQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  internalComponentName?: ?GatsbyTypes$StringQueryOperatorInput,
  matchPath?: ?GatsbyTypes$StringQueryOperatorInput,
  pageContext?: ?GatsbyTypes$JSONQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  path?: ?GatsbyTypes$StringQueryOperatorInput,
  pluginCreator?: ?GatsbyTypes$SitePluginFilterInput,
|};


declare type GatsbyTypes$Query_sitePluginArgs = {|
  browserAPIs?: ?GatsbyTypes$StringQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  name?: ?GatsbyTypes$StringQueryOperatorInput,
  nodeAPIs?: ?GatsbyTypes$StringQueryOperatorInput,
  packageJson?: ?GatsbyTypes$JSONQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  pluginFilepath?: ?GatsbyTypes$StringQueryOperatorInput,
  pluginOptions?: ?GatsbyTypes$JSONQueryOperatorInput,
  resolve?: ?GatsbyTypes$StringQueryOperatorInput,
  ssrAPIs?: ?GatsbyTypes$StringQueryOperatorInput,
  version?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$Site = {|
  ...GatsbyTypes$Node,
  ...{|
    +buildTime?: ?$ElementType<Scalars, 'Date'>,
    +children: Array<GatsbyTypes$Node>,
    +id: $ElementType<Scalars, 'ID'>,
    +internal: GatsbyTypes$Internal,
    +jsxRuntime?: ?$ElementType<Scalars, 'String'>,
    +parent?: ?GatsbyTypes$Node,
    +pathPrefix?: ?$ElementType<Scalars, 'String'>,
    +polyfill?: ?$ElementType<Scalars, 'Boolean'>,
    +siteMetadata?: ?GatsbyTypes$SiteSiteMetadata,
    +trailingSlash?: ?$ElementType<Scalars, 'String'>,
  |}
|};


declare type GatsbyTypes$Site_buildTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$SiteBuildMetadata = {|
  ...GatsbyTypes$Node,
  ...{|
    +buildTime?: ?$ElementType<Scalars, 'Date'>,
    +children: Array<GatsbyTypes$Node>,
    +id: $ElementType<Scalars, 'ID'>,
    +internal: GatsbyTypes$Internal,
    +parent?: ?GatsbyTypes$Node,
  |}
|};


declare type GatsbyTypes$SiteBuildMetadata_buildTimeArgs = {|
  difference?: ?$ElementType<Scalars, 'String'>,
  formatString?: ?$ElementType<Scalars, 'String'>,
  fromNow?: ?$ElementType<Scalars, 'Boolean'>,
  locale?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$SiteBuildMetadataConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SiteBuildMetadataEdge>,
  +group: Array<GatsbyTypes$SiteBuildMetadataGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SiteBuildMetadata>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteBuildMetadataConnection_distinctArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};


declare type GatsbyTypes$SiteBuildMetadataConnection_groupArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteBuildMetadataConnection_maxArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};


declare type GatsbyTypes$SiteBuildMetadataConnection_minArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};


declare type GatsbyTypes$SiteBuildMetadataConnection_sumArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};

declare type GatsbyTypes$SiteBuildMetadataEdge = {|
  +next?: ?GatsbyTypes$SiteBuildMetadata,
  +node: GatsbyTypes$SiteBuildMetadata,
  +previous?: ?GatsbyTypes$SiteBuildMetadata,
|};

export const GatsbyTypes$SiteBuildMetadataFieldsEnumValues = Object.freeze({
  buildTime: 'buildTime',
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  id: 'id',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id'
});


declare type GatsbyTypes$SiteBuildMetadataFieldsEnum = $Values<typeof GatsbyTypes$SiteBuildMetadataFieldsEnumValues>;

declare type GatsbyTypes$SiteBuildMetadataFilterInput = {|
  buildTime?: ?GatsbyTypes$DateQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
|};

declare type GatsbyTypes$SiteBuildMetadataGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SiteBuildMetadataEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$SiteBuildMetadataGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SiteBuildMetadata>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteBuildMetadataGroupConnection_distinctArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};


declare type GatsbyTypes$SiteBuildMetadataGroupConnection_groupArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteBuildMetadataGroupConnection_maxArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};


declare type GatsbyTypes$SiteBuildMetadataGroupConnection_minArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};


declare type GatsbyTypes$SiteBuildMetadataGroupConnection_sumArgs = {|
  field: GatsbyTypes$SiteBuildMetadataFieldsEnum,
|};

declare type GatsbyTypes$SiteBuildMetadataSortInput = {|
  fields?: ?Array<?SiteBuildMetadataFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$SiteConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SiteEdge>,
  +group: Array<GatsbyTypes$SiteGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$Site>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteConnection_distinctArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};


declare type GatsbyTypes$SiteConnection_groupArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteConnection_maxArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};


declare type GatsbyTypes$SiteConnection_minArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};


declare type GatsbyTypes$SiteConnection_sumArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};

declare type GatsbyTypes$SiteEdge = {|
  +next?: ?GatsbyTypes$Site,
  +node: GatsbyTypes$Site,
  +previous?: ?GatsbyTypes$Site,
|};

export const GatsbyTypes$SiteFieldsEnumValues = Object.freeze({
  buildTime: 'buildTime',
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  id: 'id',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  jsxRuntime: 'jsxRuntime',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  pathPrefix: 'pathPrefix',
  polyfill: 'polyfill',
  siteMetadata___description: 'siteMetadata.description',
  siteMetadata___title: 'siteMetadata.title',
  trailingSlash: 'trailingSlash'
});


declare type GatsbyTypes$SiteFieldsEnum = $Values<typeof GatsbyTypes$SiteFieldsEnumValues>;

declare type GatsbyTypes$SiteFilterInput = {|
  buildTime?: ?GatsbyTypes$DateQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  jsxRuntime?: ?GatsbyTypes$StringQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  pathPrefix?: ?GatsbyTypes$StringQueryOperatorInput,
  polyfill?: ?GatsbyTypes$BooleanQueryOperatorInput,
  siteMetadata?: ?GatsbyTypes$SiteSiteMetadataFilterInput,
  trailingSlash?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$SiteFunction = {|
  ...GatsbyTypes$Node,
  ...{|
    +absoluteCompiledFilePath: $ElementType<Scalars, 'String'>,
    +children: Array<GatsbyTypes$Node>,
    +functionRoute: $ElementType<Scalars, 'String'>,
    +id: $ElementType<Scalars, 'ID'>,
    +internal: GatsbyTypes$Internal,
    +matchPath?: ?$ElementType<Scalars, 'String'>,
    +originalAbsoluteFilePath: $ElementType<Scalars, 'String'>,
    +originalRelativeFilePath: $ElementType<Scalars, 'String'>,
    +parent?: ?GatsbyTypes$Node,
    +pluginName: $ElementType<Scalars, 'String'>,
    +relativeCompiledFilePath: $ElementType<Scalars, 'String'>,
  |}
|};

declare type GatsbyTypes$SiteFunctionConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SiteFunctionEdge>,
  +group: Array<GatsbyTypes$SiteFunctionGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SiteFunction>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteFunctionConnection_distinctArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};


declare type GatsbyTypes$SiteFunctionConnection_groupArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteFunctionConnection_maxArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};


declare type GatsbyTypes$SiteFunctionConnection_minArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};


declare type GatsbyTypes$SiteFunctionConnection_sumArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};

declare type GatsbyTypes$SiteFunctionEdge = {|
  +next?: ?GatsbyTypes$SiteFunction,
  +node: GatsbyTypes$SiteFunction,
  +previous?: ?GatsbyTypes$SiteFunction,
|};

export const GatsbyTypes$SiteFunctionFieldsEnumValues = Object.freeze({
  absoluteCompiledFilePath: 'absoluteCompiledFilePath',
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  functionRoute: 'functionRoute',
  id: 'id',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  matchPath: 'matchPath',
  originalAbsoluteFilePath: 'originalAbsoluteFilePath',
  originalRelativeFilePath: 'originalRelativeFilePath',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  pluginName: 'pluginName',
  relativeCompiledFilePath: 'relativeCompiledFilePath'
});


declare type GatsbyTypes$SiteFunctionFieldsEnum = $Values<typeof GatsbyTypes$SiteFunctionFieldsEnumValues>;

declare type GatsbyTypes$SiteFunctionFilterInput = {|
  absoluteCompiledFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  functionRoute?: ?GatsbyTypes$StringQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  matchPath?: ?GatsbyTypes$StringQueryOperatorInput,
  originalAbsoluteFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
  originalRelativeFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  pluginName?: ?GatsbyTypes$StringQueryOperatorInput,
  relativeCompiledFilePath?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$SiteFunctionGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SiteFunctionEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$SiteFunctionGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SiteFunction>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteFunctionGroupConnection_distinctArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};


declare type GatsbyTypes$SiteFunctionGroupConnection_groupArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteFunctionGroupConnection_maxArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};


declare type GatsbyTypes$SiteFunctionGroupConnection_minArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};


declare type GatsbyTypes$SiteFunctionGroupConnection_sumArgs = {|
  field: GatsbyTypes$SiteFunctionFieldsEnum,
|};

declare type GatsbyTypes$SiteFunctionSortInput = {|
  fields?: ?Array<?SiteFunctionFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$SiteGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SiteEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$SiteGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$Site>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteGroupConnection_distinctArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};


declare type GatsbyTypes$SiteGroupConnection_groupArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SiteGroupConnection_maxArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};


declare type GatsbyTypes$SiteGroupConnection_minArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};


declare type GatsbyTypes$SiteGroupConnection_sumArgs = {|
  field: GatsbyTypes$SiteFieldsEnum,
|};

declare type GatsbyTypes$SitePage = {|
  ...GatsbyTypes$Node,
  ...{|
    +children: Array<GatsbyTypes$Node>,
    +component: $ElementType<Scalars, 'String'>,
    +componentChunkName: $ElementType<Scalars, 'String'>,
    +id: $ElementType<Scalars, 'ID'>,
    +internal: GatsbyTypes$Internal,
    +internalComponentName: $ElementType<Scalars, 'String'>,
    +matchPath?: ?$ElementType<Scalars, 'String'>,
    +pageContext?: ?$ElementType<Scalars, 'JSON'>,
    +parent?: ?GatsbyTypes$Node,
    +path: $ElementType<Scalars, 'String'>,
    +pluginCreator?: ?GatsbyTypes$SitePlugin,
  |}
|};

declare type GatsbyTypes$SitePageConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SitePageEdge>,
  +group: Array<GatsbyTypes$SitePageGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SitePage>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePageConnection_distinctArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};


declare type GatsbyTypes$SitePageConnection_groupArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePageConnection_maxArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};


declare type GatsbyTypes$SitePageConnection_minArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};


declare type GatsbyTypes$SitePageConnection_sumArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};

declare type GatsbyTypes$SitePageEdge = {|
  +next?: ?GatsbyTypes$SitePage,
  +node: GatsbyTypes$SitePage,
  +previous?: ?GatsbyTypes$SitePage,
|};

export const GatsbyTypes$SitePageFieldsEnumValues = Object.freeze({
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  component: 'component',
  componentChunkName: 'componentChunkName',
  id: 'id',
  internalComponentName: 'internalComponentName',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  matchPath: 'matchPath',
  pageContext: 'pageContext',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  path: 'path',
  pluginCreator___browserAPIs: 'pluginCreator.browserAPIs',
  pluginCreator___children: 'pluginCreator.children',
  pluginCreator___children___children: 'pluginCreator.children.children',
  pluginCreator___children___children___children: 'pluginCreator.children.children.children',
  pluginCreator___children___children___id: 'pluginCreator.children.children.id',
  pluginCreator___children___id: 'pluginCreator.children.id',
  pluginCreator___children___internal___content: 'pluginCreator.children.internal.content',
  pluginCreator___children___internal___contentDigest: 'pluginCreator.children.internal.contentDigest',
  pluginCreator___children___internal___description: 'pluginCreator.children.internal.description',
  pluginCreator___children___internal___fieldOwners: 'pluginCreator.children.internal.fieldOwners',
  pluginCreator___children___internal___ignoreType: 'pluginCreator.children.internal.ignoreType',
  pluginCreator___children___internal___mediaType: 'pluginCreator.children.internal.mediaType',
  pluginCreator___children___internal___owner: 'pluginCreator.children.internal.owner',
  pluginCreator___children___internal___type: 'pluginCreator.children.internal.type',
  pluginCreator___children___parent___children: 'pluginCreator.children.parent.children',
  pluginCreator___children___parent___id: 'pluginCreator.children.parent.id',
  pluginCreator___id: 'pluginCreator.id',
  pluginCreator___internal___content: 'pluginCreator.internal.content',
  pluginCreator___internal___contentDigest: 'pluginCreator.internal.contentDigest',
  pluginCreator___internal___description: 'pluginCreator.internal.description',
  pluginCreator___internal___fieldOwners: 'pluginCreator.internal.fieldOwners',
  pluginCreator___internal___ignoreType: 'pluginCreator.internal.ignoreType',
  pluginCreator___internal___mediaType: 'pluginCreator.internal.mediaType',
  pluginCreator___internal___owner: 'pluginCreator.internal.owner',
  pluginCreator___internal___type: 'pluginCreator.internal.type',
  pluginCreator___name: 'pluginCreator.name',
  pluginCreator___nodeAPIs: 'pluginCreator.nodeAPIs',
  pluginCreator___packageJson: 'pluginCreator.packageJson',
  pluginCreator___parent___children: 'pluginCreator.parent.children',
  pluginCreator___parent___children___children: 'pluginCreator.parent.children.children',
  pluginCreator___parent___children___id: 'pluginCreator.parent.children.id',
  pluginCreator___parent___id: 'pluginCreator.parent.id',
  pluginCreator___parent___internal___content: 'pluginCreator.parent.internal.content',
  pluginCreator___parent___internal___contentDigest: 'pluginCreator.parent.internal.contentDigest',
  pluginCreator___parent___internal___description: 'pluginCreator.parent.internal.description',
  pluginCreator___parent___internal___fieldOwners: 'pluginCreator.parent.internal.fieldOwners',
  pluginCreator___parent___internal___ignoreType: 'pluginCreator.parent.internal.ignoreType',
  pluginCreator___parent___internal___mediaType: 'pluginCreator.parent.internal.mediaType',
  pluginCreator___parent___internal___owner: 'pluginCreator.parent.internal.owner',
  pluginCreator___parent___internal___type: 'pluginCreator.parent.internal.type',
  pluginCreator___parent___parent___children: 'pluginCreator.parent.parent.children',
  pluginCreator___parent___parent___id: 'pluginCreator.parent.parent.id',
  pluginCreator___pluginFilepath: 'pluginCreator.pluginFilepath',
  pluginCreator___pluginOptions: 'pluginCreator.pluginOptions',
  pluginCreator___resolve: 'pluginCreator.resolve',
  pluginCreator___ssrAPIs: 'pluginCreator.ssrAPIs',
  pluginCreator___version: 'pluginCreator.version'
});


declare type GatsbyTypes$SitePageFieldsEnum = $Values<typeof GatsbyTypes$SitePageFieldsEnumValues>;

declare type GatsbyTypes$SitePageFilterInput = {|
  children?: ?GatsbyTypes$NodeFilterListInput,
  component?: ?GatsbyTypes$StringQueryOperatorInput,
  componentChunkName?: ?GatsbyTypes$StringQueryOperatorInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  internalComponentName?: ?GatsbyTypes$StringQueryOperatorInput,
  matchPath?: ?GatsbyTypes$StringQueryOperatorInput,
  pageContext?: ?GatsbyTypes$JSONQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  path?: ?GatsbyTypes$StringQueryOperatorInput,
  pluginCreator?: ?GatsbyTypes$SitePluginFilterInput,
|};

declare type GatsbyTypes$SitePageGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SitePageEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$SitePageGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SitePage>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePageGroupConnection_distinctArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};


declare type GatsbyTypes$SitePageGroupConnection_groupArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePageGroupConnection_maxArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};


declare type GatsbyTypes$SitePageGroupConnection_minArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};


declare type GatsbyTypes$SitePageGroupConnection_sumArgs = {|
  field: GatsbyTypes$SitePageFieldsEnum,
|};

declare type GatsbyTypes$SitePageSortInput = {|
  fields?: ?Array<?SitePageFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$SitePlugin = {|
  ...GatsbyTypes$Node,
  ...{|
    +browserAPIs?: ?Array<?$ElementType<Scalars, 'String'>>,
    +children: Array<GatsbyTypes$Node>,
    +id: $ElementType<Scalars, 'ID'>,
    +internal: GatsbyTypes$Internal,
    +name?: ?$ElementType<Scalars, 'String'>,
    +nodeAPIs?: ?Array<?$ElementType<Scalars, 'String'>>,
    +packageJson?: ?$ElementType<Scalars, 'JSON'>,
    +parent?: ?GatsbyTypes$Node,
    +pluginFilepath?: ?$ElementType<Scalars, 'String'>,
    +pluginOptions?: ?$ElementType<Scalars, 'JSON'>,
    +resolve?: ?$ElementType<Scalars, 'String'>,
    +ssrAPIs?: ?Array<?$ElementType<Scalars, 'String'>>,
    +version?: ?$ElementType<Scalars, 'String'>,
  |}
|};

declare type GatsbyTypes$SitePluginConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SitePluginEdge>,
  +group: Array<GatsbyTypes$SitePluginGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SitePlugin>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePluginConnection_distinctArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};


declare type GatsbyTypes$SitePluginConnection_groupArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePluginConnection_maxArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};


declare type GatsbyTypes$SitePluginConnection_minArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};


declare type GatsbyTypes$SitePluginConnection_sumArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};

declare type GatsbyTypes$SitePluginEdge = {|
  +next?: ?GatsbyTypes$SitePlugin,
  +node: GatsbyTypes$SitePlugin,
  +previous?: ?GatsbyTypes$SitePlugin,
|};

export const GatsbyTypes$SitePluginFieldsEnumValues = Object.freeze({
  browserAPIs: 'browserAPIs',
  children: 'children',
  children___children: 'children.children',
  children___children___children: 'children.children.children',
  children___children___children___children: 'children.children.children.children',
  children___children___children___id: 'children.children.children.id',
  children___children___id: 'children.children.id',
  children___children___internal___content: 'children.children.internal.content',
  children___children___internal___contentDigest: 'children.children.internal.contentDigest',
  children___children___internal___description: 'children.children.internal.description',
  children___children___internal___fieldOwners: 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType: 'children.children.internal.ignoreType',
  children___children___internal___mediaType: 'children.children.internal.mediaType',
  children___children___internal___owner: 'children.children.internal.owner',
  children___children___internal___type: 'children.children.internal.type',
  children___children___parent___children: 'children.children.parent.children',
  children___children___parent___id: 'children.children.parent.id',
  children___id: 'children.id',
  children___internal___content: 'children.internal.content',
  children___internal___contentDigest: 'children.internal.contentDigest',
  children___internal___description: 'children.internal.description',
  children___internal___fieldOwners: 'children.internal.fieldOwners',
  children___internal___ignoreType: 'children.internal.ignoreType',
  children___internal___mediaType: 'children.internal.mediaType',
  children___internal___owner: 'children.internal.owner',
  children___internal___type: 'children.internal.type',
  children___parent___children: 'children.parent.children',
  children___parent___children___children: 'children.parent.children.children',
  children___parent___children___id: 'children.parent.children.id',
  children___parent___id: 'children.parent.id',
  children___parent___internal___content: 'children.parent.internal.content',
  children___parent___internal___contentDigest: 'children.parent.internal.contentDigest',
  children___parent___internal___description: 'children.parent.internal.description',
  children___parent___internal___fieldOwners: 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType: 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType: 'children.parent.internal.mediaType',
  children___parent___internal___owner: 'children.parent.internal.owner',
  children___parent___internal___type: 'children.parent.internal.type',
  children___parent___parent___children: 'children.parent.parent.children',
  children___parent___parent___id: 'children.parent.parent.id',
  id: 'id',
  internal___content: 'internal.content',
  internal___contentDigest: 'internal.contentDigest',
  internal___description: 'internal.description',
  internal___fieldOwners: 'internal.fieldOwners',
  internal___ignoreType: 'internal.ignoreType',
  internal___mediaType: 'internal.mediaType',
  internal___owner: 'internal.owner',
  internal___type: 'internal.type',
  name: 'name',
  nodeAPIs: 'nodeAPIs',
  packageJson: 'packageJson',
  parent___children: 'parent.children',
  parent___children___children: 'parent.children.children',
  parent___children___children___children: 'parent.children.children.children',
  parent___children___children___id: 'parent.children.children.id',
  parent___children___id: 'parent.children.id',
  parent___children___internal___content: 'parent.children.internal.content',
  parent___children___internal___contentDigest: 'parent.children.internal.contentDigest',
  parent___children___internal___description: 'parent.children.internal.description',
  parent___children___internal___fieldOwners: 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType: 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType: 'parent.children.internal.mediaType',
  parent___children___internal___owner: 'parent.children.internal.owner',
  parent___children___internal___type: 'parent.children.internal.type',
  parent___children___parent___children: 'parent.children.parent.children',
  parent___children___parent___id: 'parent.children.parent.id',
  parent___id: 'parent.id',
  parent___internal___content: 'parent.internal.content',
  parent___internal___contentDigest: 'parent.internal.contentDigest',
  parent___internal___description: 'parent.internal.description',
  parent___internal___fieldOwners: 'parent.internal.fieldOwners',
  parent___internal___ignoreType: 'parent.internal.ignoreType',
  parent___internal___mediaType: 'parent.internal.mediaType',
  parent___internal___owner: 'parent.internal.owner',
  parent___internal___type: 'parent.internal.type',
  parent___parent___children: 'parent.parent.children',
  parent___parent___children___children: 'parent.parent.children.children',
  parent___parent___children___id: 'parent.parent.children.id',
  parent___parent___id: 'parent.parent.id',
  parent___parent___internal___content: 'parent.parent.internal.content',
  parent___parent___internal___contentDigest: 'parent.parent.internal.contentDigest',
  parent___parent___internal___description: 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners: 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType: 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType: 'parent.parent.internal.mediaType',
  parent___parent___internal___owner: 'parent.parent.internal.owner',
  parent___parent___internal___type: 'parent.parent.internal.type',
  parent___parent___parent___children: 'parent.parent.parent.children',
  parent___parent___parent___id: 'parent.parent.parent.id',
  pluginFilepath: 'pluginFilepath',
  pluginOptions: 'pluginOptions',
  resolve: 'resolve',
  ssrAPIs: 'ssrAPIs',
  version: 'version'
});


declare type GatsbyTypes$SitePluginFieldsEnum = $Values<typeof GatsbyTypes$SitePluginFieldsEnumValues>;

declare type GatsbyTypes$SitePluginFilterInput = {|
  browserAPIs?: ?GatsbyTypes$StringQueryOperatorInput,
  children?: ?GatsbyTypes$NodeFilterListInput,
  id?: ?GatsbyTypes$StringQueryOperatorInput,
  internal?: ?GatsbyTypes$InternalFilterInput,
  name?: ?GatsbyTypes$StringQueryOperatorInput,
  nodeAPIs?: ?GatsbyTypes$StringQueryOperatorInput,
  packageJson?: ?GatsbyTypes$JSONQueryOperatorInput,
  parent?: ?GatsbyTypes$NodeFilterInput,
  pluginFilepath?: ?GatsbyTypes$StringQueryOperatorInput,
  pluginOptions?: ?GatsbyTypes$JSONQueryOperatorInput,
  resolve?: ?GatsbyTypes$StringQueryOperatorInput,
  ssrAPIs?: ?GatsbyTypes$StringQueryOperatorInput,
  version?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$SitePluginGroupConnection = {|
  +distinct: Array<$ElementType<Scalars, 'String'>>,
  +edges: Array<GatsbyTypes$SitePluginEdge>,
  +field: $ElementType<Scalars, 'String'>,
  +fieldValue?: ?$ElementType<Scalars, 'String'>,
  +group: Array<GatsbyTypes$SitePluginGroupConnection>,
  +max?: ?$ElementType<Scalars, 'Float'>,
  +min?: ?$ElementType<Scalars, 'Float'>,
  +nodes: Array<GatsbyTypes$SitePlugin>,
  +pageInfo: GatsbyTypes$PageInfo,
  +sum?: ?$ElementType<Scalars, 'Float'>,
  +totalCount: $ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePluginGroupConnection_distinctArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};


declare type GatsbyTypes$SitePluginGroupConnection_groupArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
  limit?: ?$ElementType<Scalars, 'Int'>,
  skip?: ?$ElementType<Scalars, 'Int'>,
|};


declare type GatsbyTypes$SitePluginGroupConnection_maxArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};


declare type GatsbyTypes$SitePluginGroupConnection_minArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};


declare type GatsbyTypes$SitePluginGroupConnection_sumArgs = {|
  field: GatsbyTypes$SitePluginFieldsEnum,
|};

declare type GatsbyTypes$SitePluginSortInput = {|
  fields?: ?Array<?SitePluginFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

declare type GatsbyTypes$SiteSiteMetadata = {|
  +description?: ?$ElementType<Scalars, 'String'>,
  +title?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$SiteSiteMetadataFilterInput = {|
  description?: ?GatsbyTypes$StringQueryOperatorInput,
  title?: ?GatsbyTypes$StringQueryOperatorInput,
|};

declare type GatsbyTypes$SiteSortInput = {|
  fields?: ?Array<?SiteFieldsEnum>,
  order?: ?Array<?GatsbyTypes$SortOrderEnum>,
|};

export const GatsbyTypes$SortOrderEnumValues = Object.freeze({
  ASC: 'ASC',
  DESC: 'DESC'
});


declare type GatsbyTypes$SortOrderEnum = $Values<typeof GatsbyTypes$SortOrderEnumValues>;

declare type GatsbyTypes$StringQueryOperatorInput = {|
  eq?: ?$ElementType<Scalars, 'String'>,
  glob?: ?$ElementType<Scalars, 'String'>,
  in?: ?Array<?$ElementType<Scalars, 'String'>>,
  ne?: ?$ElementType<Scalars, 'String'>,
  nin?: ?Array<?$ElementType<Scalars, 'String'>>,
  regex?: ?$ElementType<Scalars, 'String'>,
|};

declare type GatsbyTypes$TransformOptions = {|
  cropFocus?: ?ImageCropFocus,
  duotone?: ?GatsbyTypes$DuotoneGradient,
  fit?: ?GatsbyTypes$ImageFit,
  grayscale?: ?$ElementType<Scalars, 'Boolean'>,
  rotate?: ?$ElementType<Scalars, 'Int'>,
  trim?: ?$ElementType<Scalars, 'Float'>,
|};

declare type GatsbyTypes$WebPOptions = {|
  quality?: ?$ElementType<Scalars, 'Int'>,
|};

type $Pick<Origin: Object, Keys: Object> = $ObjMapi<Keys, <Key>(k: Key) => $ElementType<Origin, Key>>;

declare type GatsbyTypes$LayoutQueryVariables = {};


declare type GatsbyTypes$LayoutQuery = {| +site?: ?{| +siteMetadata?: ?$Pick<GatsbyTypes$SiteSiteMetadata, {| +title?: * |}> |} |};

declare type GatsbyTypes$SeoQueryVariables = {};


declare type GatsbyTypes$SeoQuery = {| +site?: ?{| +siteMetadata?: ?$Pick<GatsbyTypes$SiteSiteMetadata, {| +title?: *, +description?: * |}> |} |};
