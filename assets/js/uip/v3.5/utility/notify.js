export default {
  data() {
    return {
      notifications: [], //{status, title, message, dismissible, loader, type}
    };
  },
  mounted() {
    this.uipApp.notifications = this;
  },
  methods: {
    /**
     * Handles the older notification calls
     *
     * Converts params into object and calls new create function. Returns notification ID
     *
     * @param {String} title
     * @param {String} message
     * @param {String} type
     * @param {Boolean} dismissible
     * @param {Boolean} loader
     * @since 3.2.13
     */
    notify(title, message, type, dismissible, loader) {
      dismissible = typeof dismissible === 'undefined' ? true : dismissible;
      return this.create({
        title: title,
        status: type,
        message: message,
        dismissable: dismissible,
        loader: loader,
      });
    },

    /**
     * Pushes a new notification
     *
     * @param {Object} - notification options
     * @since 3.2.13
     */
    create(opts = {}) {
      opts.uid = this.createUID();
      this.notifications.push(opts);

      if (!opts.dismissable) return opts.uid;

      // Set timeout for removal
      const removeNotification = () => this.remove(opts.uid);
      setTimeout(removeNotification, 6000);
    },

    /**
     * Removes a notification
     *
     * @param {String} uid - the notification id
     * @since 3.2.13
     */
    remove(uid) {
      const index = this.notifications.findIndex((item) => item.uid == uid);
      if (index > -1) this.notifications.splice(index, 1);
    },

    /**
     * Returns the correct icon for notification type
     *
     * @param {String} status - the notification type
     * @since 3.2.13
     */
    returnIcon(status) {
      let icon = 'info';
      if (status == 'success') icon = 'done';
      if (status == 'error') icon = 'close';
      if (status == 'warning') icon = 'priority_high';
      return icon;
    },

    /**
     * Returns the status as a class
     *
     * @param {String} status - the notification type
     * @since 3.2.13
     */
    returnClass(status) {
      if (status) return 'uip-' + status;
      return 'uip-default';
    },
  },
  template: `
  		
      <Teleport to="body">
	  
	  	<div class="notification-drop uip-dark-mode uip-text-normal" id="notification-drop">
		
	  		<component is="style">
				.list-enter-active,
				.list-leave-active {
		  		transition: all 0.5s ease;
				}
				.list-enter-from,
				.list-leave-to {
		  		opacity: 0 !important;
		  		transform: translateX(30px);
				}
	  		</component>
	  		
	  		
	  		<TransitionGroup name="list">
	  		
				<template v-for="(notification, index) in notifications" :key="index">
				
		  			<div class="uip-notification" :class="returnClass(notification.status)">
		  			
						<div class="uip-flex uip-gap-s uip-flex-center">
						
			  			<div class="uip-border-rounder uip-notification-status uip-flex uip-flex-middle uip-padding-xxxs uip-flex-center">
							<span class="uip-text-inverse uip-text-center uip-icon"> {{ returnIcon(notification.status) }} </span>
			  			</div>
			  			
			  			<div class="uip-flex-grow uip-column-gap-xs">
							<div class="uip-text-emphasis uip-text-emphasis">{{notification.title}}</div>
							<div v-if="notification.message" class="uip-text-s uip-text-muted uip-max-w-500">{{notification.message}}</div>
			  			</div>
			  			
			  			<div v-if="notification.loader" class="uip-position-relative" >
							<span class="uip-load-spinner" ></span>
			  			</div>
			  			
			  			<div v-if="notification.dismissable" class="uip-link-muted uip-background-default uip-padding-xxs uip-border-rounder" 
			  			@click="remove(notification.uid)">
							<span class="uip-icon">close</span>
			  			</div>
			  			
						</div>
						
		  			</div>
				
				</template>
	  		
	  		</TransitionGroup>
	  	
		</div>
		
	</Teleport>
		`,
};
