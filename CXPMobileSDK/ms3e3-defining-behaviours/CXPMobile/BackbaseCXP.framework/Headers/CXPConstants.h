//
//  Constants.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 20/05/15.
//  Copyright (c) 2015 Ignacio Calderon. All rights reserved.
//

#ifndef PUBLIC_CONSTANTS
#define PUBLIC_CONSTANTS

#define CXP_VERSION @"0.9.0"

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
static NSString* kCXPConfigurationTemplateStyles = @"styles";

/// CXPConfiguration.template[scripts] key
static NSString* kCXPConfigurationTemplateScripts = @"scripts";

/// CXPConfiguration.template[launchpad-dependencies] key
static NSString* kCXPConfigurationTemplateLaunchpadDependencies = @"launchpad-dependencies";

/// CXPConfiguration.template[extra-libraries] key
static NSString* kCXPConfigurationTemplateExtraLibraries = @"extra-libraries";

#pragma mark - Renderable

/// Possible types of item that can be rendered.
typedef enum { ItemTypeLink, ItemTypePage, ItemTypeWidget, ItemTypeLayout, ItemTypePortal } CXPItemType;

#pragma mark - Model

/// Preload preference key
static NSString* const kModelPreferencePreload = @"preload";

/// Retain preference key
static NSString* const kModelPreferenceRetain = @"retain";

#pragma mark - CXPNavigationFlowInformer

static NSString* const kCXPNavigationFlowRelationshipSelf = @"SELF";
static NSString* const kCXPNavigationFlowRelationshipChild = @"CHILD";
static NSString* const kCXPNavigationFlowRelationshipParent = @"PARENT";
static NSString* const kCXPNavigationFlowRelationshipRootAncestor = @"ROOT_ANCESTOR";
static NSString* const kCXPNavigationFlowRelationshipRoot = @"ROOT";
static NSString* const kCXPNavigationFlowRelationshipSibling = @"SIBLING";
static NSString* const kCXPNavigationFlowRelationshipOther = @"OTHER";
static NSString* const kCXPNavigationFlowRelationshipExternal = @"EXTERNAL";
static NSString* const kCXPNavigationFlowRelationshipNone = @"NONE";

#endif
