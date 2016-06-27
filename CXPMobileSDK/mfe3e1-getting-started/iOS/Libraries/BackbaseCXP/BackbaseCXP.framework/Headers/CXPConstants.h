//
//  CXPConstants.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 20/05/15.
//

#ifndef PUBLIC_CONSTANTS
#define PUBLIC_CONSTANTS

#define CXP_VERSION @"2.3.0"

#pragma mark - Logging

/// Defines logLevels for logging the SDK activity.
typedef NS_ENUM(NSUInteger, CXPLogLevel) {
    /// Suppress all internal logs
    CXPLogLevelNone = 0,
    /// Only display internal error messages
    CXPLogLevelError,
    /// Only display internal error and warnings messages
    CXPLogLevelWarn,
    /// Only display internal information, warning and errors messages
    CXPLogLevelInfo,
    /// Only display internal debug, information, warning and errors messages
    CXPLogLevelDebug,
    /// Logs everything, this is the default value.
    CXPLogLevelEverything
};

#pragma mark - Renderable

/// Possible types of item that can be rendered.
typedef NS_ENUM(NSUInteger, CXPItemType) {
    /// Renderable item is link reference
    CXPItemTypeLink,
    /// Renderable item is Page
    CXPItemTypePage,
    /// Renderable item is a Widget
    CXPItemTypeWidget,
    /// Renderable item is a Container / Laout
    CXPItemTypeLayout,
    /// Renderable item is an App
    CXPItemTypeApp,
    /// Renderable item is a divider
    CXPItemTypeDivider
};

#pragma mark - Model

/// Preload preference key
extern NSString* const kModelPreferencePreload;

/// Retain preference key
extern NSString* const kModelPreferenceRetain;

#pragma mark - Model Sources
/// Use to load a model from a cached file
extern NSString* const kModelSourceCache;

/// Use to load the model from a server especified in the configurations
extern NSString* const kModelSourceServer;

/// Use to load the model form a local file especified in the configurations
extern NSString* const kModelSourceFile;

#pragma mark - CXPNavigationFlowInformer

/// Navigation flow informer self relationship
extern NSString* const kCXPNavigationFlowRelationshipSelf;

/// Navigation flow informer child relationship
extern NSString* const kCXPNavigationFlowRelationshipChild;

/// Navigation flow informer parent relationship
extern NSString* const kCXPNavigationFlowRelationshipParent;

/// Navigation flow informer root ancestor relationship
extern NSString* const kCXPNavigationFlowRelationshipRootAncestor;

/// Navigation flow informer root relationship
extern NSString* const kCXPNavigationFlowRelationshipRoot;

/// Navigation flow informer sibling relationship
extern NSString* const kCXPNavigationFlowRelationshipSibling;

/// Navigation flow informer other relationship
extern NSString* const kCXPNavigationFlowRelationshipOther;

/// Navigation flow informer external relationship
extern NSString* const kCXPNavigationFlowRelationshipExternal;

/// Navigation flow informer none relationship
extern NSString* const kCXPNavigationFlowRelationshipNone;

#endif
