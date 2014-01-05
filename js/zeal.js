/**
* ZealJS v0.1.1 by @ridzeal
* Copyright 2013 Zeal Cross Team
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
if (!jQuery) { throw new Error("jQuery required") }

function Zeal() {
	// private property
	var version = '0.1.1',
		author = {
			nick: 'Rid Zeal',
			twitter: '@ridzeal'
		},
		zeal = this; // Point to root
		
	// public property
	this.cols = {};
	
	/**
	 * ZealJS Getter
	 */
	this.get = {
		// Get Version of ZealJS
		Version: function() {
			return version;
		},
		
		// Get ZealJS Information by attribute
		Info: function(attr) {
			switch(attr) {
				case 'version':
					return version;
				case 'author':
					return author.nick;
				default:
					return null;
			}
		}
	};
	
	/**
	 * ZealJS Generator Module
	 */
	this.gen = {
		/** Sub-Module Table */
		table: {
			/**
			 * crud
			 * Create Table with CRUD functionality
			 * @param	id		string	Table ID
			 * @param	cols	object	Columns Setting
			 * @param	crud	object	CRUD URL
			 * crud: {
			 *		create: <link>,
			 *		read: <link>,
			 *		update: <link>,
			 *		delete: <link>
			 * }
			 */
			master: function(id, cols, crud) {
				if (!crud
					&&!crud["create"]
					&&!crud["read"]
					&&!crud["update"]
					&&!crud["delete"]) {
					return false;
				} else {
					var table = $("<table></table>"),
						thead = $("<thead></thead>"),
						tbody = $("<tbody></tbody>"),
						tableId = id+"Table",
						addBtn = $("<button></button>");
					
					// Table Attribute
					table.attr("id",tableId);
					table.addClass("z-table");
					thead.attr("id",tableId+"Head");
					tbody.attr("id",tableId+"Body");
					
					// Prepare Add Button
					addBtn.html("Add")
						.addClass("z-button");
					
					// Table header
					var trHead = $("<tr></tr>");
					thead.append(trHead);
					for(i in cols) {
						trHead.append($("<td></td>")
									  .attr("id",tableId+i)
									  .html(cols[i].display));
					}
					trHead.append($("<td></td>")
								  .append(addBtn)
								  .addClass("col-10"));
					
					// Table Content
					table.append(thead);
					table.append(tbody);
					
					return table;
				}
			}
		},
		
		/** Sub-Module Form Element */
		element: {
			/**
			 * text
			 * Create Text Element
			 * @param	string	id		Element ID
			 * @param	string	config	Config for creating text
			 */
			text: function(id, config) {
				if (!config) config = {};
				var el = $("<input>");
				el.attr("id", id);
				el.attr("type", "text");
				el.addClass("z-form-element");
				(config.name) ? el.attr("name", config.name): el.attr("name", id);
				if (config.placeholder) {
				    el.attr("placeholder",config.placeholder);
				}
				
				// Additional Attributes
				if (config.attributes) {
				    for(i in config.attributes) {
						el.attr(i,config.attributes[i]);
					}
				}
				
				return el;
			},
			
			/**
			 * select
			 * Create Select Element
			 * @param	string			id			Element ID
			 * @param	array/object	optValue	Options Value
			 * @param	string			config		Config for creating text
			 * optValue = {<text> : <value>}
			 */
			select: function(id, optValue, config) {
				if (!config) config = {};
				var el = $("<select></select");
				el.attr("id", id);
				el.attr("type", "text");
				el.addClass("z-form-element");
				(config.name) ? el.attr("name", config.name): el.attr("name", id);
				
				// Insert Options
				for(i in optValue) {
					var opt = $("<option></option>");
					opt.attr("value",i);
					opt.html(optValue[i]);
					el.append(opt);
				}
				
				// Additional Attributes
				if (config.attributes) {
				    for(i in config.attributes) {
						el.attr(i,config.attributes[i]);
					}
				}
				
				return el;
			}
		}
	};
	
	/**
	 * makeTableRes
	 * Make a table become Zeal Version responsive
	 */
	this.makeTableRes = function(tableId) {
		var cls = this,
			table = $("#"+tableId), newTable,
			optVal = {},
			newTableId = table.attr("id")+"Clone",
			tableHeadTd = $("#"+tableId+">thead >tr >td"),
			tableBodyTr = $("#"+tableId+">tbody >tr");

		// Columns Pool
		tableHeadTd.each(function(i){
			$(this).attr('colnum',i);
			cls.cols[i] = $(this);
			optVal[i] = $(this).html();
		});

		// Assign Content Column Info
		tableBodyTr.each(function(i){
			$(this).attr('rownum',i);
			$(this).children("td").each(function(j){
				$(this).attr('colnum',j);
			});
		});

		// Create Table Duplicate
		newTable = table.clone().insertAfter(table);
		newTable.attr('id', newTableId);

		// Assign Class
		newTable.addClass("sm-dev-only");
		table.addClass("sm-dev-hide");

		// Remove Table Duplicate Columns greater than 2
		for(var i=0;i<tableHeadTd.length;i++) {
			var cell = $("#"+newTableId+" [colnum="+i+"]");
			if(i>1) {
				cell.remove();
			} else {
				cell.attr("id",newTableId+"Col"+(i+1));
				cell.attr("class","col-50");
			}
		}

		// Replace Table Duplicate Header with select element
		this.inner2select(newTableId+"Col1", newTableId+"Col1Select"
			, optVal, 0);
		this.inner2select(newTableId+"Col2", newTableId+"Col2Select"
			, optVal, 1);

		// Column Changer
		$("#"+newTableId+"Col1Select").change(function() {
			cls.changeCol($(this).val(), 0, tableId, newTableId);
		});
		$("#"+newTableId+"Col2Select").change(function() {
			cls.changeCol($(this).val(), 1, tableId, newTableId);
		});
	};
	
	/**
	 * inner2select
	 * Replace innerHTML with select element
	 * @param	divId		string		Element which inner tobe replaced
	 * @param	selectId	string		ID of select element
	 * @param	optValue	arrayobject	Value of select option
	 * @param	selValue	string		Selected Value
	 */
	this.inner2select = function(divId, selectId, optValue, selValue) {
		// Create Element
		var selectEl = $("<select></select>");
		selectEl.attr("id", selectId);
		
		// Fill Options
		$.each(optValue, function(key, value) {
			selectEl
				.append($('<option>', { value : key })
				.text(value));
		});
		
		// Select Value
		selectEl.val(selValue);
		
		// Change Content with select
		$("#"+divId).html(selectEl);
	};
	
	/**
	 * changeCol
	 * Change Column content
	 * @param	colNum		int		Column Number that will be extract
	 * @param	colClone	int		Column Number of Clone Table
	 * @param	refId		string	ID of main table
	 * @param	cloneId		string	ID of cloned table
	 */
	this.changeCol = function(colNum, colClone, refId, cloneId) {
		var colSrc = $("#"+refId+" tbody [colnum="+colNum+"]"),
			colTarget = $("#"+cloneId+" tbody [colnum="+colClone+"]"),
			srcHtml = {};
		
		// Pool source innerHTML into array
		colSrc.each(function(i) {
			srcHtml[i] = $(this).html();
		});
		
		// Replace Content
		colTarget.each(function(i) {
			$(this).html(srcHtml[i]);
		});
	};
	
	/**
	 * ZealJS Enterprise Application Module
	 */
	this.erp = {
		/**
		 * Sub Module Master
		 */
		master: {
			/**
			 * exConfig
			 * Default Config for creating master, mainly for example purposes
			 */
			exConfig: function() {
				var config = {};
				config.cols = {
					'col1': {
						// Element Text
						display: "Column1", // Display Name in Col Table and Element Label
						dbName: "COL1", // Column Name in database
						table: { // Table setting
							width: 1,
							align: "left"
						},
						element: { // Element Setting
							type: "text",
							placeholder: "Type random text"
						},
						option: { // Optional Setting
							//update as needed
						}
					},
					'col2': {
						// Element Select
						display: "Column2",
						dbName: "COL1",
						table: {
							width: 1,
							align: "left"
						},
						element: {
							type: "select",
							placeholder: "Type random text",
							options: {
								'false': "False",
								'true': "True"
							}
						}
					}
				};
				config.crud = {
					create: "",
					read: "",
					update: "",
					delete: ""
				}
				return config;
			},
			
			/**
			 * create
			 * Create New complete setup master program
			 * @param	appendTo	string		Container ID
			 * @param	id			string		ID for setup master
			 * @param	config		object		Config for create new master
			 * config.crud {
			 *		create: <url>,
			 *		read: <url>,
			 *		update: <url>,
			 *		delete: <url>
			 * }
			 * config.cols = {
			 *		display: 	// Display Name in Column Table and Element Label
			 *		dbName: 	// Column Name in database
			 *		table: {	// Table Setting
			 *			width:
			 *			align:
			 *		}
			 *		element: {	// Element Form and Filter Setting
			 *			type:
			 *			placeholder:
			 *		}
			 *		option: {	// Additional Options
			 *			
			 *		}
			 * }
			 */
			create: function(appendTo, id, config) {
				// Set Default Config, some for example purpose
				if ($.isEmptyObject(config) || !config)
					config = this.exConfig();
				
				// Private Variable
				var cont = $("#"+appendTo),
					obj = $("<div></div>").attr("id",id+"Placeholder"),
					divTab = $("<div></div>").attr("id",id+"TabNav"),
					divFilter = $("<div></div>").attr("id",id+"DivFilter"),
					divTable = $("<div></div>").attr("id",id+"DivTable"),
					divForm = $("<div></div>").attr("id",id+"DivForm");
				
				// Setting Placeholder Class
				obj.addClass("z-master-placeholder");
				divTab.addClass("z-master-tabnav");
				divFilter.addClass("z-master-tab");
				divFilter.addClass("active");
				divTable.addClass("z-master-tab");
				divForm.addClass("z-master-tab");
				
				// Append to Placeholder
				obj.append(divTab);
				obj.append($("<div></div>")
						   .addClass("z-master-tabcontent")
						   .append(divFilter)
						   .append(divTable)
						   .append(divForm));
				
				/** Tab Navigation */
				var tabContent = $("<div></div>")
					.append($("<span></span>")
							.append($("<a></a>")
									.attr("id",id+"FilterLink")
									.attr("content",id+"DivFilter")
									.html("Filter")
									.addClass("tab-link")
									.addClass("active")))
					.append($("<span></span>")
							.append($("<a></a>")
									.attr("id",id+"TableLink")
									.attr("content",id+"DivTable")
									.html("Table")
									.addClass("tab-link")))
					.append($("<span></span>")
							.append($("<a></a>")
									.attr("id",id+"FormLink")
									.attr("content",id+"DivForm")
									.html("Form")
									.addClass("tab-link")));
				divTab.append(tabContent);
				
				/** Filter */
				divFilter.append(this.createFilter(id, config));
				
				/** Table */
				divTable.append(this.createTable(id, config));
				
				/** Form */
				divForm.append(this.createForm(id, config));
				
				// Append Placeholder to Container
				cont.append(obj);
				
				// Assign All Link
				this.assignLink(id);
			},
			
			/**
			 * assignLink
			 * Assign Link Action for all link and button
			 * @param	id			string		ID for setup master
			 */
			assignLink: function(id) {
				// Tab Navigation
				$(".tab-link").click(function() {
					$(".tab-link").removeClass("active");
					$(this).addClass("active");
					$(".z-master-tab").removeClass("active");
					$("#"+$(this).attr("content")).addClass("active");
				});
			},
			
			/**
			 * createFilter
			 * Create Setup Master Filter Form
			 * @param	id			string		ID for setup master
			 * @param	config		object		Config for create new master
			 */
			createFilter: function(id, config) {
				if (!config) config = {};
				var form = $("<form></form>"),
					btn = $("<button></button>");
				
				// Form Attribute
				form.attr("id",id+"FilterForm");
				form.addClass("z-form");
				
				// Prepare Filter Button
				btn.attr("id",id+"FilterBtn");
				btn.html("Filter Data");
				btn.addClass("z-button");
				
				/** Create Elements */
				for(i in config.cols) {
					var col = config.cols[i],
						label = $("<label></label>"),
						el, elId, elConfig = {};
					if (col.dbName) {
					    elId = id+"Filter"+col.dbName;
					} else {
						elId = id+"Filter"+i;
					}
					
					// Prepare Element Config
					if (col.element.placeholder) {
					    elConfig.placeholder = col.element.placeholder;
					}
					
					// Switch-Case Element
					switch(col.element.type) {
						case 'select':
							var tmpOpt = {};
							tmpOpt['none'] = 'All';
							for(i in col.element.options) {
								tmpOpt[i] = col.element.options[i];
							}
							el = zeal.gen.element.select(elId, tmpOpt, elConfig);
							break;
						case 'text':
						default:
							el = zeal.gen.element.text(elId, elConfig);
					}
					
					// Prepare Label
					if (col.display) {
					    label.html(col.display);
					}
					label.attr("for",elId);
					
					// Append to Form
					form.append($("<div></div>")
								.append(label)
								.append(el));
				}
				form.append(btn);
				
				return form;
			},
			
			/**
			 * createTable
			 * Create Setup Master Table
			 * @param	id			string		ID for setup master
			 * @param	config		object		Config for create new master
			 */
			createTable: function(id, config) {
				return zeal.gen.table.master(id, config.cols, config.crud);
			},
			
			/**
			 * createForm
			 * Create Setup Master CRUD Manipulation Form
			 * @param	id			string		ID for setup master
			 * @param	config		object		Config for create new master
			 */
			createForm: function(id, config) {
				if (!config) config = {};
				var form = $("<form></form>"),
					btn = $("<button></button>"),
					mode = $("<span></span>"),
					formId = id+"CrudForm";
				
				// Form Attribute
				form.attr("id",formId);
				form.addClass("z-form");
				
				// Prepare Filter Button
				btn.attr("id",formId+"Btn");
				btn.attr("disabled",true);
				btn.html("Update");
				btn.addClass("z-button");
				
				// Prepare Label Mode
				mode.attr("id",formId+"Mode");
				mode.html("View Mode");
				mode.addClass("z-label");
				
				form.append($("<div></div>")
							.append(mode)
							.css("text-align","right"));
				for(i in config.cols) {
					var col = config.cols[i],
						label = $("<label></label>"),
						el, elConfig = {},
						elId = formId+"Crud"+i;
					if (col.dbName) {
					    elId = formId+col.dbName;
					}
					
					// Prepare Element Config
					if (col.element.placeholder) {
					    elConfig.placeholder = col.element.placeholder;
					}
					
					// Disable Element
					elConfig.attributes = {
						class: "z-form-element",
						disabled: true
					};
					
					// Switch-Case Element
					switch(col.element.type) {
						case 'select':
							el = zeal.gen.element.select(elId,
														 col.element.options,
														 elConfig);
							break;
						case 'text':
						default:
							el = zeal.gen.element.text(elId, elConfig);
					}
					
					// Prepare Label
					if (col.display) {
					    label.html(col.display);
					}
					label.attr("for",elId);
					
					// Append to Form
					form.append($("<div></div>")
								.append(label)
								.append(el));
				}
				form.append(btn);
				
				return form;
			},
			
			/**
			 * formState
			 * Change Form State
			 */
			formState: {
				/**
				 * read
				 * Change Form to Read Only Mode
				 * @param	string	formId	Form ID
				 */
				read: function(formId) {
					$("#"+formId+"Mode").html("View Mode");
				},
				/**
				 * create
				 * Change Form to Create Mode
				 * @param	string	formId	Form ID
				 */
				create: function(formId) {
					$("#"+formId+"Mode").html("Create Mode");
				},
				/**
				 * update
				 * Change Form to Update Mode
				 * @param	string	formId	Form ID
				 */
				update: function(formId) {
					$("#"+formId+"Mode").html("Update Mode");
				}
			},
			
			/**
			 * crud
			 * CRUD Process
			 */
			crud: {
				/**
				 * create
				 * Post to server to create new data
				 * @param	
				 */
				create: function(formId, url) {
					var formData = $("#"+formId).serialize();
					$.post(url, formData)
					.done(function( data ) {
						alert( "Data Loaded: " + data );
					});
				}
			}
		},
		
		/**
		 * Sub Module Transaction
		 */
		transaction: {
			
		},
		
		/**
		 * Sub Module Report
		 */
		report: {
			
		}
	};
};

z = new Zeal();
