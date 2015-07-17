//
//  Renderer.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 27/02/15.
//  Copyright (c) 2015 Backbase. All rights reserved.
//

#import <Foundation/Foundation.h>
@protocol RendererDelegate;

/**
 * Renderer protocol.
 * Objects conforming this protocol are able to render Renderable items and control their graphical properties.
 */
@protocol Renderer <NSObject>
@required
/**
 * Starts the rendering of a renderable item in a given container.
 * @param container Container where the item should be rendered.
 * @param error If an error occurs, upon return contains an NSError object that describes the problem.
 */
- (BOOL)start:(UIView*)container error:(NSError**)error;

/**
 * Reloads the current renderable item.
 */
- (void)reload;

/**
 * Gets the size of this renderer.
 * @return The size of the renderer.
 */
- (CGSize)size;

/**
 * Gets the reference of the renderable item used by this renderer. It will come handy with some asynchronous calls and
 * pub sub payloads.
 * @return The reference to the Renderable item used at the start method.
 */
- (NSObject<Renderable>*)item;

@optional
/**
 * Resizes the renderer to the new size.
 * @param newSize The new size (width,height) for the renderer.
 */
- (void)scaleTo:(CGSize)newSize;

/**
 * Resizes the renderer to the new position.
 * @param newPosition The new position (x,y) for the renderer.
 */
- (void)moveTo:(CGPoint)newPosition;

/**
 * Sets a delegate to respond to events created by the Renderer.
 * This should be called <b>BEFORE</b> the rendering has started.
 * @param delegate Instance conforming the protocol to respond to the events.
 */
- (void)delegate:(NSObject<RendererDelegate>*)delegate;
@end