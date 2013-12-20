/**
* ZealJS v0.1.0 by @ridzeal
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
	var version = '1.0',
		author = {
			nick: 'Rid Zeal',
			twitter: '@ridzeal'
		};
	
	// public property
	this.cols = {};
	
	// Getter
	this.getVersion = function() {
		return version;
	};
	
	this.getInfo = function(attr) {
		switch(attr) {
			case 'version':
				return version; break;
			case 'author':
				return author.nick; break;
			default:
				return null;
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
		
		colTarget.each(function(i) {
			$(this).html(srcHtml[i]);
		});
	};
};

z = new Zeal();