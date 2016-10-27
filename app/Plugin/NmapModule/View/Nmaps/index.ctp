<?php
// Copyright (C) <2015>  <it-novum GmbH>
//
// This file is dual licensed
//
// 1.
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, version 3 of the License.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

// 2.
//	If you purchased an openITCOCKPIT Enterprise Edition you can use this file
//	under the terms of the openITCOCKPIT Enterprise Edition license agreement.
//	License agreement and license key will be shipped with the order
//	confirmation.
?>
<?php $this->Paginator->options(array('url' => $this->params['named'])); ?>
<div class="row">
    <div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
        <h1 class="page-title txt-color-blueDark">
            <i class="fa fa-users fa-fw "></i>
            <?php echo __('Monitoring'); ?>
            <span>>
                <?php echo __('Nmap Templates'); ?>
			</span>
        </h1>
    </div>
</div>

<section id="widget-grid" class="">
    <div class="row">
        <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget jarviswidget-color-blueDark" id="wid-id-1" data-widget-editbutton="false" >
                <header>
                    <div class="widget-toolbar" role="menu">
                        <?php
                        if($this->Acl->hasPermission('add')):
                            echo $this->Html->link(__('New'), '/nmap_module/'.$this->params['controller'].'/add', array('class' => 'btn btn-xs btn-success', 'icon' => 'fa fa-plus'));
                            echo " "; //Fix HTML
                        endif;
                        ?>
                    </div>
                </header>
                <div>
                    <div class="widget-body no-padding">
                        <div class="mobile_table">
                            <table id="nmap_template_list" class="table table-striped table-bordered smart-form" style="">
                                <thead>
                                <tr>
                                    <?php $order = $this->Paginator->param('order'); ?>
                                    <th class="no-sort" style="width: 15px;"><i class="fa fa-check-square-o fa-lg"></i></th>
                                    <th class="no-sort"><?php echo __('Container'); ?></th>
                                    <th class="no-sort"><?php echo __('Port number'); ?></th>
                                    <th class="no-sort"><?php echo __('Protocol'); ?></th>
                                    <th class="no-sort"><?php echo __('Service'); ?></th>
                                    <th class="no-sort"><?php echo __('Service Template'); ?></th>
                                    <th class="no-sort text-center" ><i class="fa fa-gear fa-lg"></i></th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach($allNmaps as $nmap): ?>
                                    <?php $allowEdit = $this->Acl->isWritableContainer($nmap['Container']['parent_id']); ?>
                                    <tr>
                                        <td class="text-center" style="width: 15px;">
                                        </td>
                                        <td><?php echo $nmap['Container']['name']; ?></td>
                                        <td><?php echo $nmap['NmapTemplate']['port_number']; ?></td>
                                        <td><?php echo $nmap['NmapTemplate']['protocol']; ?></td>
                                        <td><?php echo $nmap['NmapTemplate']['service']; ?></td>
                                        <td><?php echo $nmap['Servicetemplate']['name']; ?></td>
                                        <td class="width-160">
                                            <div class="btn-group">
                                                <?php if($this->Acl->hasPermission('edit') && $allowEdit): ?>
                                                    <a href="<?php echo Router::url(['action' => 'edit', $nmap['NmapTemplate']['id']]); ?>" class="btn btn-default">&nbsp;<i class="fa fa-cog"></i>&nbsp;</a>
                                                <?php else: ?>
                                                    <a href="javascript:void(0);" class="btn btn-default">&nbsp;<i class="fa fa-cog"></i>&nbsp;</a>
                                                <?php endif; ?>
                                                <a href="javascript:void(0);" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span></a>
                                                <ul class="dropdown-menu">
                                                    <?php if($this->Acl->hasPermission('edit') && $allowEdit): ?>
                                                        <li>
                                                            <a href="<?php echo Router::url(['action' => 'edit', $nmap['NmapTemplate']['id']]); ?>"><i class="fa fa-cog"></i> <?php echo __('Edit'); ?></a>
                                                        </li>
                                                    <?php endif; ?>
                                                    <?php if($this->Acl->hasPermission('delete') && $allowEdit): ?>
                                                        <li class="divider"></li>
                                                        <li>
                                                            <?php echo $this->Form->postLink('<i class="fa fa-trash-o"></i> '.__('Delete'), ['controller' => 'nmaps', 'action' => 'delete', $nmap['NmapTemplate']['id']], ['class' => 'txt-color-red', 'escape' => false]);?>
                                                        </li>
                                                    <?php endif;?>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>

                        <div style="padding: 5px 10px;">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="dataTables_info" style="line-height: 32px;" id="datatable_fixed_column_info"><?php echo $this->Paginator->counter(__('Page').' {:page} '.__('of').' {:pages}, '.__('Total').' {:count} '.__('entries')); ?></div>
                                </div>
                                <div class="col-sm-6 text-right">
                                    <div class="dataTables_paginate paging_bootstrap">
                                        <?php echo $this->Paginator->pagination(array(
                                            'ul' => 'pagination'
                                        )); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</section>
