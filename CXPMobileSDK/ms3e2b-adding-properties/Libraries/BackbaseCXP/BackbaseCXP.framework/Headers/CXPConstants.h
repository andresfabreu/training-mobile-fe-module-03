//
//  CXPConstants.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 20/05/15.
//

#ifndef PUBLIC_CONSTANTS
#define PUBLIC_CONSTANTS

#define CXP_VERSION @"1.0.0"

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
};

#pragma mark - CXPConfiguration

/// CXPConfiguration.template[styles] key
extern NSString* kCXPConfigurationTemplateStyles;

/// CXPConfiguration.template[scripts] key
extern NSString* kCXPConfigurationTemplateScripts;

/// CXPConfiguration.template[extra-libraries] key
extern NSString* kCXPConfigurationTemplateExtraLibraries;

#pragma mark - Renderable

/// Possible types of item that can be rendered.
typedef enum { CXPItemTypeLink, CXPItemTypePage, CXPItemTypeWidget, CXPItemTypeLayout, CXPItemTypeApp } CXPItemType;

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
