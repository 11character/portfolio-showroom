<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark disable-user-select">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-content">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse navbar-content">
            <ul class="navbar-nav w-100">
                <li class="nav-item">
                    <router-link :to="{name: 'home'}" :class="homeClass" class="nav-link">
                        <span>Home</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{name: 'file'}" :class="fileClass" class="nav-link">
                        <span>File</span>
                    </router-link>
                </li>

                <li :class="lastLinkClass" class="nav-item">
                    <router-link :to="{name: 'product'}" :class="productClass" class="nav-link">
                        <span>Product</span>
                    </router-link>
                </li>

                <li v-if="separatePage" class="nav-item px-lg-2 mr-lg-auto">
                    <span class="navbar-text text-white">{{ separatePage }}</span>
                </li>

                <li class="nav-item">
                    <a :href="'./logout.php'" class="nav-link">Logout</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        props: ['pageName', 'separatePage'],
        data: function () {
            const me = this;

            return {
                lastLinkClass: {
                    'mr-lg-auto': !me.separatePage
                },
                homeClass: {
                    'active': me.pageName == 'home'
                },
                fileClass: {
                    'active': me.pageName == 'file'
                },
                productClass: {
                    'active': me.pageName == 'product'
                }
            };
        },
        mounted: function () {
            $('.navbar-toggler').on('click.top.nav', function () {
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 250);
            });
        },
        beforeDestroy: function () {
            $('.navbar-toggler').off('click.top.nav');
        }
    }
</script>